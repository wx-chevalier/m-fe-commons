/** 文本转化为语音播报 */
export function textToSpeech(str: string, lang: 'zh' | 'en') {
  if (
    typeof window === 'undefined' ||
    typeof SpeechSynthesisUtterance === 'undefined'
  ) {
    return false;
  }

  try {
    const msg = new SpeechSynthesisUtterance(str);
    msg.lang = lang;
    msg.voice = speechSynthesis.getVoices().filter(voice => {
      return voice.name == 'Whisper';
    })[0];
    speechSynthesis.speak(msg);

    return true;
  } catch (_) {
    return false;
  }
}
