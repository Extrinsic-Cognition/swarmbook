import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/embertide-app/ui/intro/room/procedural/three.module.js';
import { createLaptop } from './tracenet-laptop-model.mjs';

const rows = [
  [...'QWERTYUIOP', { key: 'Backspace', label: '⌫', width: 1.3 }],
  [...'ASDFGHJKL', { key: 'Enter', label: '↵', width: 2.3 }],
  [{ key: 'Shift', label: 'shift', width: 1.3 }, ...'ZXCVBNM', ',', '.', '?'],
  ['Escape', 'Control', 'Alt'].map(key => ({ key, label: key.toLowerCase() })).concat([{ key: ' ', label: 'SPACE', width: 6 }, { key: 'ArrowLeft', label: '←' }, { key: 'ArrowRight', label: '→' }]),
];

test('screen corners and key landings belong to the same connected laptop', () => {
  const laptop = createLaptop({ rows });
  assert.equal(laptop.keys.size, 38);
  const { group: screen, width, height } = laptop.screen;
  const lowerLeft = screen.localToWorld(new THREE.Vector3(-width / 2, -height / 2, 0));
  const upperRight = screen.localToWorld(new THREE.Vector3(width / 2, height / 2, 0));
  assert.ok(Math.abs(upperRight.x - lowerLeft.x - 10.9) < 1e-8);
  assert.ok(upperRight.z < lowerLeft.z, 'the display leans behind its real hinge');
  assert.ok(lowerLeft.y > .9, 'display clears the physical keyboard');
  for (const [key, landing] of laptop.keys) {
    assert.equal(landing.group.userData.key, key);
    assert.equal(landing.group.parent, laptop.group);
    assert.equal(landing.group.position.y, landing.baseY);
    assert.ok(Math.abs(landing.x) + landing.width / 2 <= 5.251, 'key fits the deck');
    assert.ok(landing.topY > landing.baseY + .4, 'characters land above cap faces');
  }
  laptop.dispose();
});

test('model owns one shadow light and releases every shared geometry once', () => {
  const laptop = createLaptop({ rows });
  const unique = new Set(); let shadowLights = 0, triangleCount = 0;
  laptop.group.traverse(object => {
    if (object.isLight && object.castShadow) shadowLights++;
    if (object.geometry) unique.add(object.geometry);
    if (object.isMesh) triangleCount += (object.geometry.index?.count ?? object.geometry.attributes.position.count) / 3 * (object.count ?? 1);
  });
  assert.equal(shadowLights, 1);
  assert.ok(triangleCount < 40000, `static model is bounded: ${triangleCount} triangles`);
  const disposals = new Map();
  for (const geometry of unique) geometry.addEventListener('dispose', () => disposals.set(geometry, (disposals.get(geometry) ?? 0) + 1));
  laptop.dispose();
  assert.equal(laptop.group.children.length, 0);
  assert.equal(disposals.size, unique.size);
  for (const count of disposals.values()) assert.equal(count, 1);
});
