export const MAX_TEXT_LENGTH = 5000;

const QUESTION_CUES = /还没有|尚未|未完成|缺少|需要|待|问题|确认|计划|风险|不足|希望|预计/;

export function organizeText(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('请先粘贴一段文字');
  }

  const text = input.trim();
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`文字长度不能超过 ${MAX_TEXT_LENGTH} 字`);
  }

  const segments = splitIntoSegments(text);
  const title = segments[0].slice(0, 28);
  const points = (segments.length > 1 ? segments.slice(1, 6) : segments.slice(0, 1));
  const questions = segments
    .filter((segment) => QUESTION_CUES.test(segment))
    .slice(0, 4)
    .map(toQuestion);

  return {
    title,
    points,
    questions: questions.length > 0 ? questions : ['这段内容中最重要的下一步是什么？'],
    mode: '本地规则模式',
  };
}

function splitIntoSegments(text) {
  return text
    .split(/[。！？!?\n；;]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function toQuestion(segment) {
  if (/分类/.test(segment)) {
    return `${segment}，具体需要补充哪些分类？`;
  }

  if (/还没有|尚未|未完成|缺少/.test(segment)) {
    return `${segment}，具体需要补充哪些内容？`;
  }

  if (/需要|确认|计划|预计/.test(segment)) {
    return `${segment}，确认结果是什么？`;
  }

  if (/问题|风险|不足/.test(segment)) {
    return `${segment}，下一步如何处理？`;
  }

  return `${segment}，负责人和截止时间是什么？`;
}
