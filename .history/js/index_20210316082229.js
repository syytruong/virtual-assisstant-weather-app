// const APP_ID = 'cf26e7b2c25b5acd18ed5c3e836fb235';
const APP_ID = 'a8b620f6eda8f3af9ea6dfa90375178a';
const DEFAULT_VALUE = '--';
const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

searchInput.addEventListener('change', (e) => {
  fetch(
    `api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=a8b620f6eda8f3af9ea6dfa90375178a`
    `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=en`
  ).then(async (res) => {
    const data = await res.json();
    console.log('[Search Input]', data);
    cityName.innerHTML = data.name || DEFAULT_VALUE;
    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
    weatherIcon.setAttribute(
      'src',
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;

    sunrise.innerHTML =
      moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
    sunset.innerHTML =
      moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
    windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
  });
});

// Tro ly ao
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.lang = 'en-EN';
recognition.continuous = false;

const microphone = document.querySelector('.microphone');

const speak = (text) => {
  if (synth.speaking) {
    console.error('Busy. Speaking...');
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);

  utter.onend = () => {
    console.log('SpeechSynthesisUtterance.onend');
  };
  utter.onerror = (err) => {
    console.error('SpeechSynthesisUtterance.onerror', err);
  };

  synth.speak(utter);
};

const handleVoice = (text) => {
  console.log('text', text);

  // "weather in Helsinki" => ["weather in", "Helsinki"]
  const handledText = text.toLowerCase();
  if (handledText.includes('weather in')) {
    const location = handledText.split('in')[1].trim();

    console.log('location', location);
    searchInput.value = location;
    const changeEvent = new Event('change');
    searchInput.dispatchEvent(changeEvent);
    return;
  }

  const container = document.querySelector('.container');
  if (handledText.includes('change background')) {
    const color = handledText.split('background')[1].trim();
    container.style.background = color;
    return;
  }

  if (handledText.includes('default background')) {
    container.style.background = '';
    return;
  }

  if (handledText.includes('what time')) {
    const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
    speak(textToSpeech);
    return;
  }

  speak('Try again');
};

microphone.addEventListener('click', (e) => {
  e.preventDefault();

  recognition.start();
  microphone.classList.add('recording');
});

recognition.onspeechend = () => {
  recognition.stop();
  microphone.classList.remove('recording');
};

recognition.onerror = (err) => {
  console.error(err);
  microphone.classList.remove('recording');
};

recognition.onresult = (e) => {
  console.log('onresult', e);
  const text = e.results[0][0].transcript;
  handleVoice(text);
};
