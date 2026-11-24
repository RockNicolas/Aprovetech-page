'use client';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import track from './hand-track.json';

/*
  Vídeo real (Pexels, licença livre) de uma mão segurando um celular com a tela branca enquanto o
  indicador da outra mão toca e desliza. Em WebGL, o branco da tela é trocado pela tela do
  AproveTech, encaixada nos quatro cantos rastreados quadro a quadro (hand-track.json). O dedo
  continua por cima da tela porque só os pixels brancos são trocados.

  A rolagem controla o tempo do vídeo. As telas do app reagem ao dedo de verdade: a lista rola
  quando o dedo arrasta, o cartão afunda onde ele toca e o botão de confirmar enche enquanto ele
  segura.
*/

const FR = track.frames as number[][];
const FPS = track.fps;
const DURATION = FR[FR.length - 1][0];

// Tela do app desenhada em unidades de 280 × 591 (proporção da tela no vídeo).
const UW = 280;
const UH = 591;
const SCALE = 2;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

function sample(t: number) {
  const f = clamp(t * FPS, 0, FR.length - 1);
  const i = Math.floor(f);
  const j = Math.min(FR.length - 1, i + 1);
  const a = f - i;
  const A = FR[i];
  const B = FR[j];
  const q: number[] = [];
  for (let k = 1; k <= 8; k++) q.push(A[k] + (B[k] - A[k]) * a);
  let tu = 0;
  let tv = 0;
  if (A[9] && B[9]) {
    tu = A[9] + (B[9] - A[9]) * a;
    tv = A[10] + (B[10] - A[10]) * a;
  } else {
    const N = a < 0.5 ? A : B;
    tu = N[9];
    tv = N[10];
  }
  return { q, tu, tv };
}
const vAt = (t: number) => sample(t).tv;

// Momentos do vídeo (em segundos) em que o dedo faz cada gesto.
const T = {
  dragA: 1.0,
  dragB: 1.62,
  tap1: 2.42,
  open: 2.8,
  detA: 5.36,
  detB: 8.62,
  tap2: 8.9,
  sheet: 9.14,
  holdA: 9.5,
  holdB: 11.45,
  done: 11.48,
  histA: 13.25,
  histB: 14.25,
};
const V_DRAG = vAt(T.dragA);
const V_DET = vAt(T.detA);
const V_HIST = vAt(T.histA);

function listScroll(t: number) {
  return clamp((V_DRAG - vAt(clamp(t, T.dragA, T.dragB))) * UH, 0, 560);
}
function detailScroll(t: number) {
  const raw = (V_DET - vAt(clamp(t, T.detA, T.detB))) * UH * 0.95;
  let d = raw < 0 ? raw * 0.25 : Math.min(raw, 330);
  if (t > T.detB && d < 0) d *= 1 - ease(seg(t, T.detB, T.detB + 0.35));
  return d;
}
function historyScroll(t: number) {
  const raw = (V_HIST - vAt(clamp(t, T.histA, T.histB))) * UH * 0.9;
  return raw < 0 ? raw * 0.25 : Math.min(raw, 170);
}

// ---------- pintura da tela do app (tema claro, combina com a luz da tela no vídeo) ----------
const C = {
  bg: '#f6f4f0',
  surface: '#ffffff',
  line: '#e6e0d8',
  text: '#242839',
  muted: '#6b7184',
  accent: '#ff7a3d',
  accentText: '#c4500f',
  onAccent: '#211b17',
  amberBg: '#fff1d6',
  amber: '#8f5a10',
  green: '#167455',
  greenBg: '#e3f4ec',
};

type Ctx = CanvasRenderingContext2D;
let FONT = 'Inter, "Segoe UI", sans-serif';

function rr(g: Ctx, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
}
function txt(g: Ctx, s: string, x: number, y: number, size: number, weight: number, color: string, align: CanvasTextAlign = 'left') {
  g.font = `${weight} ${size}px ${FONT}`;
  g.fillStyle = color;
  g.textAlign = align;
  g.fillText(s, x, y);
}
function ripple(g: Ctx, x: number, y: number, t: number, t0: number) {
  const e = seg(t, t0, t0 + 0.5);
  if (e <= 0 || e >= 1) return;
  g.beginPath();
  g.arc(x, y, 12 + 44 * ease(e), 0, Math.PI * 2);
  g.fillStyle = `rgba(255,122,61,${0.28 * (1 - e)})`;
  g.fill();
}
function statusBar(g: Ctx) {
  txt(g, '9:41', 26, 24, 12.5, 700, C.text);
  g.fillStyle = C.text;
  for (let i = 0; i < 4; i++) g.fillRect(222 + i * 4.5, 20 - i * 2, 3, 4 + i * 2);
  rr(g, 244, 14, 20, 10, 3);
  g.strokeStyle = C.text;
  g.lineWidth = 1.2;
  g.stroke();
  g.fillRect(246, 16, 13, 6);
}
function logoTile(g: Ctx, x: number, y: number, s: number) {
  rr(g, x, y, s, s, s * 0.28);
  g.fillStyle = '#2a2a30';
  g.fill();
  g.beginPath();
  g.moveTo(x + s * 0.27, y + s * 0.52);
  g.lineTo(x + s * 0.44, y + s * 0.68);
  g.lineTo(x + s * 0.74, y + s * 0.33);
  g.strokeStyle = C.accent;
  g.lineWidth = s * 0.12;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.stroke();
}

const CARD_TOP = 186;
const CARD_H = 96;
const CARD_GAP = 10;
const BASE_CARDS = [
  { type: 'PEDIDO · 4821', who: 'Concreto Usinado Aurora', site: 'Residencial Aurora', value: 'R$ 38.420,00' },
  { type: 'CONTRATO · 309', who: 'Elétrica Horizonte', site: 'Edifício Horizonte', value: 'R$ 84.500,00' },
  { type: 'SOLICITAÇÃO · 77', who: 'Almoxarifado central', site: 'Residencial Aurora', value: '12 itens' },
  { type: 'PEDIDO · 4825', who: 'Ferro Norte', site: 'Parque das Oliveiras', value: 'R$ 21.300,00' },
  { type: 'COTAÇÃO · 58', who: '3 fornecedores', site: 'Edifício Horizonte', value: 'R$ 9.870,00' },
  { type: 'PEDIDO · 4830', who: 'Esquadrias Sul', site: 'Residencial Aurora', value: 'R$ 17.640,00' },
  { type: 'CONTRATO · 312', who: 'Pinturas Litoral', site: 'Parque das Oliveiras', value: 'R$ 52.000,00' },
];
const TARGET = { type: 'MEDIÇÃO · 112', who: 'Terraplenagem Oliveiras', site: 'Parque das Oliveiras', value: 'R$ 126.900,00', high: true };

// O cartão que fica debaixo do dedo no toque vira a medição de valor alto.
const TAP1_Y = vAt(T.tap1 + 0.05) * UH;
const TARGET_INDEX = Math.floor((TAP1_Y + listScroll(T.tap1) - CARD_TOP) / (CARD_H + CARD_GAP));
const CARDS = [...BASE_CARDS.slice(0, TARGET_INDEX), TARGET, ...BASE_CARDS.slice(TARGET_INDEX)].slice(0, 8);

function drawList(g: Ctx, t: number) {
  g.fillStyle = C.bg;
  g.fillRect(0, 0, UW, UH);
  statusBar(g);
  logoTile(g, 16, 46, 28);
  txt(g, 'Suas aprovações', 52, 59, 15.5, 700, C.text);
  txt(g, 'Vértice Engenharia', 52, 74, 11, 500, C.muted);

  rr(g, 14, 90, 252, 66, 16);
  g.fillStyle = C.surface;
  g.fill();
  txt(g, 'Valor aguardando decisão', 28, 110, 10.5, 500, C.muted);
  txt(g, 'R$ 412.640,00', 28, 135, 22, 800, C.text);
  txt(g, '8 documentos', 28, 150, 10.5, 700, C.accentText);

  txt(g, 'PENDÊNCIAS', 16, 176, 9.5, 800, C.muted);

  const s = listScroll(t);
  const pressed = t >= T.tap1 && t < T.open + 0.05;
  g.save();
  g.beginPath();
  g.rect(0, 182, UW, UH - 182);
  g.clip();
  CARDS.forEach((c, i) => {
    const y = CARD_TOP + i * (CARD_H + CARD_GAP) - s;
    if (y > UH || y + CARD_H < 182) return;
    const isTarget = i === TARGET_INDEX && pressed;
    g.save();
    if (isTarget) {
      g.translate(140, y + CARD_H / 2);
      g.scale(0.97, 0.97);
      g.translate(-140, -(y + CARD_H / 2));
    }
    rr(g, 14, y, 252, CARD_H, 15);
    g.fillStyle = isTarget ? '#fff3ec' : C.surface;
    g.fill();
    g.strokeStyle = isTarget ? C.accent : C.line;
    g.lineWidth = isTarget ? 1.6 : 1;
    g.stroke();
    txt(g, c.type, 28, y + 22, 9.5, 800, C.muted);
    if ('high' in c) {
      rr(g, 186, y + 11, 66, 17, 8.5);
      g.fillStyle = C.amberBg;
      g.fill();
      txt(g, 'Valor alto', 219, y + 23, 9, 800, C.amber, 'center');
    }
    txt(g, c.who, 28, y + 48, 13.5, 700, C.text);
    txt(g, c.site, 28, y + 76, 10.5, 500, C.muted);
    txt(g, c.value, 252, y + 76, 13.5, 800, C.text, 'right');
    g.restore();
  });
  g.restore();
}

function drawDetail(g: Ctx, t: number) {
  g.fillStyle = C.bg;
  g.fillRect(0, 0, UW, UH);
  const d = detailScroll(t);

  g.save();
  g.beginPath();
  g.rect(0, 80, UW, 372);
  g.clip();
  g.translate(0, -d);
  rr(g, 16, 92, 70, 18, 9);
  g.fillStyle = C.amberBg;
  g.fill();
  txt(g, 'Valor alto', 51, 105, 9.5, 800, C.amber, 'center');
  txt(g, 'R$ 126.900,00', 16, 146, 30, 800, C.text);
  txt(g, 'Terraplenagem Oliveiras', 16, 170, 13.5, 700, C.text);
  txt(g, 'Parque das Oliveiras', 16, 187, 11, 500, C.muted);

  const rows: [string, string][] = [
    ['Etapa', '3 de 5'],
    ['Período', '01 a 31/out'],
    ['Contrato', '287'],
    ['Solicitante', 'Rafael, engenharia'],
    ['Retenção', '5%'],
  ];
  rr(g, 14, 202, 252, rows.length * 34 + 8, 16);
  g.fillStyle = C.surface;
  g.fill();
  rows.forEach(([k, v], i) => {
    const y = 226 + i * 34;
    txt(g, k, 28, y, 11.5, 500, C.muted);
    txt(g, v, 252, y, 11.5, 700, C.text, 'right');
    if (i < rows.length - 1) {
      g.fillStyle = C.line;
      g.fillRect(28, y + 12, 224, 1);
    }
  });

  txt(g, 'EXECUÇÃO', 16, 398, 9.5, 800, C.muted);
  rr(g, 16, 408, 248, 8, 4);
  g.fillStyle = C.line;
  g.fill();
  rr(g, 16, 408, 248 * 0.6, 8, 4);
  g.fillStyle = C.accent;
  g.fill();
  txt(g, '60% do contrato medido', 16, 434, 11, 600, C.text);

  txt(g, 'COMPOSIÇÃO FINANCEIRA', 16, 466, 9.5, 800, C.muted);
  const comp: [string, string][] = [
    ['Serviços executados', 'R$ 120.000,00'],
    ['Materiais', 'R$ 12.900,00'],
    ['Retenção (5%)', '− R$ 6.000,00'],
    ['Total', 'R$ 126.900,00'],
  ];
  rr(g, 14, 476, 252, comp.length * 34 + 8, 16);
  g.fillStyle = C.surface;
  g.fill();
  comp.forEach(([k, v], i) => {
    const y = 500 + i * 34;
    const last = i === comp.length - 1;
    txt(g, k, 28, y, 11.5, last ? 800 : 500, last ? C.text : C.muted);
    txt(g, v, 252, y, 11.5, 800, C.text, 'right');
  });
  txt(g, 'ITENS MEDIDOS', 16, 650, 9.5, 800, C.muted);
  ['Escavação mecânica', 'Aterro compactado', 'Transporte de solo'].forEach((s, i) => {
    rr(g, 14, 660 + i * 44, 252, 36, 12);
    g.fillStyle = C.surface;
    g.fill();
    txt(g, s, 28, 683 + i * 44, 11.5, 600, C.text);
  });
  g.restore();

  // topo fixo
  g.fillStyle = C.bg;
  g.fillRect(0, 0, UW, 80);
  statusBar(g);
  txt(g, '‹', 16, 66, 24, 500, C.text);
  txt(g, 'Medição · 112', 140, 62, 13.5, 700, C.text, 'center');
  g.fillStyle = C.line;
  g.fillRect(0, 79, UW, 1);

  // rodapé fixo com os botões
  const grd = g.createLinearGradient(0, 440, 0, 456);
  grd.addColorStop(0, 'rgba(246,244,240,0)');
  grd.addColorStop(1, C.bg);
  g.fillStyle = grd;
  g.fillRect(0, 440, UW, 16);
  g.fillStyle = C.bg;
  g.fillRect(0, 456, UW, UH - 456);
  rr(g, 14, 461, 80, 52, 15);
  g.strokeStyle = C.line;
  g.lineWidth = 1.2;
  g.fillStyle = C.surface;
  g.fill();
  g.stroke();
  txt(g, 'Reprovar', 54, 492, 12, 700, C.text, 'center');
  const pressed = t >= T.tap2 && t < T.sheet + 0.05;
  g.save();
  if (pressed) {
    g.translate(183, 487);
    g.scale(0.96, 0.96);
    g.translate(-183, -487);
  }
  rr(g, 102, 461, 164, 52, 15);
  g.fillStyle = pressed ? '#ff8d55' : C.accent;
  g.fill();
  txt(g, 'Aprovar', 184, 492, 14, 800, C.onAccent, 'center');
  g.restore();
  txt(g, 'Toque para revisar antes de enviar', 140, 536, 10, 500, C.muted, 'center');
}

function drawSheet(g: Ctx, t: number, tip: { x: number; y: number }) {
  const e = ease(seg(t, T.sheet, T.sheet + 0.32));
  g.fillStyle = `rgba(20,20,26,${0.42 * e})`;
  g.fillRect(0, 0, UW, UH);
  const top = 236 + (1 - e) * 360;
  g.save();
  rr(g, 0, top, UW, UH - 236 + 20, 26);
  g.fillStyle = C.surface;
  g.fill();
  rr(g, 120, top + 10, 40, 4, 2);
  g.fillStyle = C.line;
  g.fill();
  txt(g, 'REVISE SUA DECISÃO', 18, top + 40, 9.5, 800, C.accentText);
  txt(g, 'Aprovar medição 112?', 18, top + 66, 19, 800, C.text);
  rr(g, 14, top + 80, 252, 102, 14);
  g.fillStyle = C.bg;
  g.fill();
  const rows: [string, string][] = [
    ['Fornecedor', 'Terraplenagem Oliveiras'],
    ['Obra', 'Parque das Oliveiras'],
    ['Valor', 'R$ 126.900,00'],
  ];
  rows.forEach(([k, v], i) => {
    txt(g, k, 28, top + 104 + i * 30, 11, 500, C.muted);
    txt(g, v, 252, top + 104 + i * 30, 11, 700, C.text, 'right');
  });
  rr(g, 14, top + 192, 252, 26, 9);
  g.fillStyle = C.amberBg;
  g.fill();
  txt(g, 'Valor alto: segure o botão para confirmar', 140, top + 209, 9.8, 700, C.amber, 'center');

  const hold = seg(t, T.holdA, T.holdB);
  const by = top + 232;
  rr(g, 14, by, 252, 58, 16);
  g.fillStyle = '#fff3ec';
  g.fill();
  g.strokeStyle = C.accent;
  g.lineWidth = 1.6;
  g.stroke();
  if (hold > 0) {
    g.save();
    rr(g, 14, by, 252, 58, 16);
    g.clip();
    g.fillStyle = C.accent;
    g.fillRect(14, by, 252 * hold, 58);
    g.restore();
  }
  txt(
    g,
    hold > 0 ? `Segurando… ${Math.round(hold * 100)}%` : 'Segure para confirmar',
    hold > 0 ? 110 : 140,
    by + 35,
    14,
    800,
    hold > 0.35 ? C.onAccent : C.accentText,
    'center',
  );
  g.restore();

  if (hold > 0 && hold < 1) {
    g.beginPath();
    g.arc(tip.x, tip.y, 26 + 10 * Math.sin(t * 9) * 0.3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hold);
    g.strokeStyle = C.accent;
    g.lineWidth = 4;
    g.lineCap = 'round';
    g.stroke();
  }
}

function drawDone(g: Ctx, t: number) {
  g.fillStyle = C.bg;
  g.fillRect(0, 0, UW, UH);
  statusBar(g);
  const e = ease(seg(t, T.done, T.done + 0.4));
  const h = historyScroll(t);
  g.save();
  g.translate(140, 170);
  g.scale(0.85 + 0.15 * e, 0.85 + 0.15 * e);
  g.globalAlpha = e;
  g.beginPath();
  g.arc(0, 0, 58, 0, Math.PI * 2);
  g.fillStyle = 'rgba(22,116,85,0.08)';
  g.fill();
  g.beginPath();
  g.arc(0, 0, 44, 0, Math.PI * 2);
  g.fillStyle = C.greenBg;
  g.fill();
  const c = seg(t, T.done + 0.15, T.done + 0.55);
  g.beginPath();
  g.moveTo(-17, 1);
  if (c > 0) g.lineTo(-17 + 11 * Math.min(1, c * 2), 1 + 11 * Math.min(1, c * 2));
  if (c > 0.5) g.lineTo(-6 + 25 * (c - 0.5) * 2, 12 - 26 * (c - 0.5) * 2);
  g.strokeStyle = C.green;
  g.lineWidth = 6;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.stroke();
  g.restore();

  g.globalAlpha = e;
  txt(g, 'Aprovado', 140, 266, 26, 800, C.text, 'center');
  txt(g, 'Medição 112 · R$ 126.900,00', 140, 288, 12, 500, C.muted, 'center');
  rr(g, 14, 306, 252, 52, 14);
  g.fillStyle = C.surface;
  g.fill();
  txt(g, 'REGISTRO', 28, 326, 9, 800, C.muted);
  txt(g, 'Marina Costa aprovou às 09:42', 28, 346, 11.5, 700, C.text);

  g.save();
  g.beginPath();
  g.rect(0, 372, UW, UH - 372);
  g.clip();
  g.translate(0, -h);
  txt(g, 'PRÓXIMAS PENDÊNCIAS', 16, 392, 9.5, 800, C.muted);
  CARDS.filter((_, i) => i !== TARGET_INDEX)
    .slice(0, 5)
    .forEach((cd, i) => {
      const y = 402 + i * 70;
      rr(g, 14, y, 252, 62, 14);
      g.fillStyle = C.surface;
      g.fill();
      txt(g, cd.type, 28, y + 20, 9, 800, C.muted);
      txt(g, cd.who, 28, y + 42, 12.5, 700, C.text);
      txt(g, cd.value, 252, y + 42, 12.5, 800, C.text, 'right');
    });
  g.restore();
  g.globalAlpha = 1;
}

function paintUI(g: Ctx, t: number) {
  const s = sample(t);
  const tip = { x: s.tu * UW + 3, y: s.tv * UH + 6 };
  g.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  g.clearRect(0, 0, UW, UH);

  if (t < T.open) {
    drawList(g, t);
  } else if (t < T.done) {
    const e = ease(seg(t, T.open, T.open + 0.3));
    if (e < 1) {
      g.save();
      g.globalAlpha = 1 - e;
      g.translate(-60 * e, 0);
      drawList(g, t);
      g.restore();
    }
    g.save();
    g.translate((1 - e) * UW, 0);
    drawDetail(g, t);
    g.restore();
    if (t >= T.sheet) drawSheet(g, t, tip);
  } else {
    drawDone(g, t);
  }

  ripple(g, tip.x, tip.y, t, T.tap1);
  ripple(g, tip.x, tip.y, t, T.tap2);
  ripple(g, tip.x, tip.y, t, T.holdA);
}

// ---------- geometria ----------
function sq2quad(q: number[]) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = q;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const h = (dx1 * dy3 - dx3 * dy1) / den;
  return [x1 - x0 + g * x1, x3 - x0 + h * x3, x0, y1 - y0 + g * y1, y3 - y0 + h * y3, y0, g, h, 1];
}
function inv3(m: number[]) {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const Cc = d * h - e * g;
  const det = a * A + b * B + c * Cc;
  return [A / det, -(b * i - c * h) / det, (b * f - c * e) / det, B / det, (a * i - c * g) / det, -(a * f - c * d) / det, Cc / det, -(a * h - b * g) / det, (a * e - b * d) / det];
}

// ---------- WebGL ----------
const VS = `attribute vec2 aPos; varying vec2 vUv;
void main(){ vUv = vec2((aPos.x + 1.0) * 0.5, (1.0 - aPos.y) * 0.5); gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FS = `precision mediump float;
varying vec2 vUv;
uniform sampler2D uVideo; uniform sampler2D uUI; uniform mat3 uHinv; uniform vec4 uCrop;
void main(){
  vec2 uv = uCrop.xy + vUv * uCrop.zw;
  vec3 col = texture2D(uVideo, uv).rgb;
  vec3 h = uHinv * vec3(uv, 1.0);
  vec2 s = h.xy / h.z;
  float inside = smoothstep(-0.004, 0.006, s.x) * smoothstep(-0.004, 0.006, 1.0 - s.x)
               * smoothstep(-0.003, 0.004, s.y) * smoothstep(-0.003, 0.004, 1.0 - s.y);
  float mn = min(min(col.r, col.g), col.b);
  float mx = max(max(col.r, col.g), col.b);
  float key = smoothstep(0.52, 0.74, mn) * (1.0 - smoothstep(0.14, 0.28, mx - mn)) * inside;
  vec3 ui = texture2D(uUI, clamp(s, 0.0, 1.0)).rgb;
  float light = clamp(mn / 0.95, 0.84, 1.02);
  gl_FragColor = vec4(mix(col, ui * light, key), 1.0);
}`;

// Recorte do vídeo mostrado: x, y, largura, altura (0 a 1).
const CROP = [0.06, 0.12, 0.88, 0.8];
const ASPECT = (CROP[2] * 1080) / (CROP[3] * 1920);

function makeGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = (unit: number) => {
    const t = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  };
  const tVideo = tex(0);
  const tUI = tex(1);
  gl.uniform1i(gl.getUniformLocation(prog, 'uVideo'), 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'uUI'), 1);
  gl.uniform4fv(gl.getUniformLocation(prog, 'uCrop'), CROP);
  const uH = gl.getUniformLocation(prog, 'uHinv');
  return {
    draw(video: HTMLVideoElement, ui: HTMLCanvasElement, q: number[]) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tVideo);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tUI);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ui);
      const m = inv3(sq2quad(q));
      gl.uniformMatrix3fv(uH, false, [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}

const STEPS = [
  { at: 0, title: 'Role a lista', text: 'As pendências da sua alçada, com valor e obra à vista.' },
  { at: 2.3, title: 'Toque no documento', text: 'O detalhe abre com o que importa para decidir.' },
  { at: 5.1, title: 'Confira os detalhes', text: 'Execução, composição financeira e itens, rolando com o dedo.' },
  { at: 8.75, title: 'Toque em Aprovar', text: 'O resumo aparece antes de qualquer envio.' },
  { at: 9.45, title: 'Segure para confirmar', text: 'Valores altos pedem um gesto a mais. Nada sai por engano.' },
  { at: 11.45, title: 'Aprovado', text: 'A decisão fica registrada com quem aprovou e quando.' },
];

export function RealHand() {
  const section = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const [time, setTime] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    target.current = clamp(v) * (DURATION - 0.04);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    const el = section.current;
    if (!canvas || !box || !el) return;
    FONT = getComputedStyle(document.body).fontFamily || FONT;

    const video = document.createElement('video');
    video.src = '/video/maos.mp4';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';

    const ui = document.createElement('canvas');
    ui.width = UW * SCALE;
    ui.height = UH * SCALE;
    const g = ui.getContext('2d')!;

    const gl = makeGL(canvas);
    if (!gl) {
      setFailed(true);
      return;
    }

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = box.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);

    let visible = false;
    // Começa a carregar e desenhar uma tela antes de a seção aparecer.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && video.readyState < 2) video.load();
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);

    const onReady = () => setReady(true);
    video.addEventListener('loadeddata', onReady);
    // Alguns navegadores só liberam o primeiro quadro depois de um play.
    video.play().then(() => video.pause()).catch(() => {});

    let cur = 0;
    let last = performance.now();
    let raf = 0;
    let shown = -1;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || video.readyState < 2) {
        if (!video.paused) video.pause();
        return;
      }
      // Rolando para baixo, o vídeo toca com a velocidade da rolagem (decodificação contínua,
      // bem mais suave que pular de quadro). Para cima ou em saltos grandes, ele busca o quadro.
      const diff = target.current - video.currentTime;
      if (diff > 0.03 && diff < 1.5) {
        video.playbackRate = clamp(diff * 3, 0.6, 3.5);
        if (video.paused) video.play().catch(() => {});
        cur = video.currentTime;
      } else {
        if (!video.paused) video.pause();
        cur += (target.current - cur) * Math.min(1, dt * 8);
        if (!video.seeking && Math.abs(video.currentTime - cur) > 1 / 45) video.currentTime = cur;
      }
      const t = video.currentTime;
      paintUI(g, t);
      gl.draw(video, ui, sample(t).q);
      // O texto ao lado só precisa de 20 atualizações por segundo de vídeo.
      const q = Math.round(t * 20) / 20;
      if (q !== shown) {
        shown = q;
        setTime(q);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      video.removeEventListener('loadeddata', onReady);
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  let step = 0;
  STEPS.forEach((s, i) => {
    if (time >= s.at) step = i;
  });

  return (
    <section className="onehand realhand" id="uma-mao" ref={section}>
      <div className="onehand-sticky">
        <div className="wrap onehand-grid">
          <div className="onehand-copy">
            <p className="eyebrow">NA PALMA DA MÃO</p>
            <h2>
              Aprovar cabe <span className="accent">num toque.</span>
            </h2>
            <ol className="oh-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className={i === step ? 'on' : i < step ? 'past' : ''}>
                  <span className="oh-dot" />
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="oh-progress" aria-hidden="true">
              <i style={{ transform: `scaleX(${time / DURATION})` }} />
            </div>
          </div>

          <div className="onehand-stage-wrap">
            <div className="onehand-glow" aria-hidden="true" />
            <div
              className={`rh-frame${ready ? ' ready' : ''}`}
              ref={boxRef}
              style={{ aspectRatio: `${ASPECT}` }}
              role="img"
              aria-label="Vídeo de uma mão segurando o celular enquanto a outra aprova uma medição no AproveTech"
            >
              {failed ? (
                <video className="rh-fallback" src="/video/maos.mp4" muted playsInline autoPlay loop />
              ) : (
                <canvas ref={canvasRef} />
              )}
              {!ready && !failed && <span className="rh-loading">Carregando vídeo…</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
