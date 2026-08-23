import { organizeText } from './organizer.js';

const input = document.querySelector('#source-text');
const organizeButton = document.querySelector('#organize-button');
const resetButton = document.querySelector('#reset-button');
const status = document.querySelector('#status');
const errorMessage = document.querySelector('#error-message');
const results = document.querySelector('#results');
const resultTitle = document.querySelector('#result-title');
const resultPoints = document.querySelector('#result-points');
const resultQuestions = document.querySelector('#result-questions');
const sourceCount = document.querySelector('#source-count');
const exampleButton = document.querySelector('#example-button');

const sampleText = '季度复盘准备开始。销售数据已经整理完成。客户流失原因还没有分类。周三需要和产品确认下季度重点。';

function setStatus(message, tone = 'neutral') {
  status.textContent = message;
  status.dataset.tone = tone;
}

function updateCount() {
  sourceCount.textContent = `${input.value.length} / 5000`;
}

function renderList(container, items) {
  container.replaceChildren();
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item;
    container.append(li);
  }
}

function renderResult(result) {
  resultTitle.textContent = result.title;
  renderList(resultPoints, result.points);
  renderList(resultQuestions, result.questions);
  results.hidden = false;
}

function organize() {
  setStatus('正在整理……', 'busy');
  errorMessage.hidden = true;

  try {
    const result = organizeText(input.value);
    renderResult(result);
    setStatus(`${result.mode} · 已完成`, 'success');
  } catch (error) {
    results.hidden = true;
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
    setStatus('需要补充输入', 'error');
  }
}

function reset() {
  input.value = '';
  results.hidden = true;
  errorMessage.hidden = true;
  updateCount();
  setStatus('等待输入', 'neutral');
  input.focus();
}

input.addEventListener('input', updateCount);
organizeButton.addEventListener('click', organize);
resetButton.addEventListener('click', reset);
exampleButton.addEventListener('click', () => {
  input.value = sampleText;
  updateCount();
  input.focus();
});

updateCount();
