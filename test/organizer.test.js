import test from 'node:test';
import assert from 'node:assert/strict';

import { organizeText } from '../public/organizer.js';

test('organizes a short text into a title, key points, and questions', () => {
  const result = organizeText(
    '季度复盘准备开始。销售数据已经整理完成。客户流失原因还没有分类。周三需要和产品确认下季度重点。',
  );

  assert.equal(result.title, '季度复盘准备开始');
  assert.deepEqual(result.points, [
    '销售数据已经整理完成',
    '客户流失原因还没有分类',
    '周三需要和产品确认下季度重点',
  ]);
  assert.deepEqual(result.questions, [
    '客户流失原因还没有分类，具体需要补充哪些分类？',
    '周三需要和产品确认下季度重点，确认结果是什么？',
  ]);
});

test('rejects empty input with a user-facing validation error', () => {
  assert.throws(() => organizeText('  '), /请先粘贴一段文字/);
});

test('rejects input above the first-version limit', () => {
  assert.throws(() => organizeText('a'.repeat(5001)), /文字长度不能超过 5000 字/);
});
