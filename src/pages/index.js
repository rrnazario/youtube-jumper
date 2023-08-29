import Head from 'next/head'
import styles from '../styles/Home.module.css'
import YouTube from 'react-youtube'
import { useEffect, useState } from 'react'
import Interval from '../components/interval/interval';
import intervalService from '../components/infrastructure/interval.service'

export default function Home() {
  const [id, setId] = useState();
  const [ytUrl, setYtUrl] = useState();
  const [shareYtUrl, setShareYtUrl] = useState();
  const [intervals, setIntervals] = useState();
  const [intervalArray, setIntervalArray] = useState([]);
  const [loop, setLoop] = useState();

  const [videoObj, setVideoObj] = useState();

  const [checkingIntervalsOnServer, setCheckingIntervalsOnServer] = useState(false);

  const [capturing, setCapturing] = useState(false);
  const [capturingInterval, setCapturingInterval] = useState({});
  const [captureCaption, setCaptureCaption] = useState('Capture time');

  useEffect(() => {
    const sessionYtUrl = localStorage.getItem("ytUrl");
    if (sessionYtUrl) {
      localStorage.clear("ytUrl");
      onYoutubeUrlChange(sessionYtUrl);
    }
  }, []);

  useEffect(() => {
    if (intervals) {
      setShareYtUrl(`${window.location.origin}/share/${id}`);
    }
  }, [intervals]);

  const onReady = async (e) => {

    e.target.pauseVideo();
  }

  const onYoutubeUrlChange = (value) => {
    setYtUrl(value);

    if (value === "") {
      setId(undefined);
      return;
    }

    const invalidChars = ["?v=", "/", "?v%3D"]

    const youtubeIdsRegExExtractor = new RegExp(/\?v\=([\_\-a-zA-Z\d]{10,})|\/([\_\-a-zA-Z\d]{10,})|\?v\%3D([\_\-a-zA-Z\d]{10,})/)
    let results = youtubeIdsRegExExtractor.exec(value);

    results = results?.filter(f => f !== undefined && !invalidChars.some(s => f.indexOf(s) >= 0))

    if (!results || !results.length) {
      clearInterval(loop);
      setLoop(null);
      setIntervals([]);
      setIntervalArray(null);
      setYtUrl(null);
    }
    else {
      if (!TryGetLocalIntervals(results[0])) {
        setCheckingIntervalsOnServer(true);

        intervalService().get(results[0])
          .then(async response => {
            if (response && response.data !== '') {
              const localArray = generateIntervalObjects(response.data);

              await setIntervalArray(localArray);
              await setIntervals(response.data);
            }

            setCheckingIntervalsOnServer(false);
          })
          .catch(() => setCheckingIntervalsOnServer(false));
      }
    }

    if (results)
      setId(results[0]);
  }

  const TryGetLocalIntervals = (youtubeId) => {
    const localIntervals = localStorage.getItem(youtubeId);

    if (localIntervals && localIntervals !== '') {
      const localArray = generateIntervalObjects(localIntervals);

      setIntervalArray(localArray);
      setIntervals(localIntervals);

      return true;
    }

    return false;
  }

  const onIntervalsChange = (e) => {
    //17:49 -> 25:50
    //44:18 -> 1:01:00
    const localArray = generateIntervalObjects(e.target.value);

    if (localArray && localArray.length > 0 && id) {
      intervalService().add(id, { intervals: e.target.value });

      localStorage.setItem(id, e.target.value);
    }

    setIntervalArray(localArray);
    setIntervals(e.target.value);
  }

  const generateIntervalObjects = (strIntervals) => {
    const localArray = []

    strIntervals.split("\n").forEach(line => {
      const newInterval = Interval(line);

      if (newInterval.IsValid)
        localArray = [...localArray, newInterval];
    })

    return localArray;
  }

  const onStateChange = async (e) => {
    console.debug(e);

    if (id && e.data === 1 && !loop) {
      await setLoop(setInterval((video, arrIntervals) => {

        arrIntervals.forEach(inter => {
          const currTime = video.getCurrentTime();
          console.debug(`Curr: ${currTime}, Begin ${inter.Begin()}, End: ${inter.End()}`)

          if (inter.Begin() <= currTime && inter.End() > currTime) {
            console.log(`Changing ${inter.Begin()}`)
            e.target.loadVideoById(id, inter.End());

            return;
          }
        });

      }, 1000, e.target, intervalArray));
    }
  }

  const onCaptureInterval = async () => {
    if (!id || !videoObj) return;

    capturing
      ? await captureEnd()
      : await captureBegin();
  }

  const captureEnd = async () => {
    await setCaptureCaption('Capture time');

    await setCapturing(false);
    let newInterval = { ...capturingInterval, End: videoObj.getCurrentTime() };
    await setCapturingInterval(newInterval);

    const strInterval = `${newInterval.Begin} -> ${newInterval.End}`

    newInterval = Interval(strInterval);

    if (!intervals)
      await setIntervals(`${newInterval.Stringify()}`)
    else
      await setIntervals(`${intervals}\n${newInterval.Stringify()}`)

    await setIntervalArray([...intervalArray, newInterval])
  }

  const captureBegin = async () => {
    await setCapturing(true);
    await setCaptureCaption('Capturing...');

    await setCapturingInterval({ Begin: videoObj.getCurrentTime() })
  }

  const youtubeOpts = {
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 2,
      modestbranding: 1
    },
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Youtube Jumper</title>
        <meta name="description" content="Created by Rogim Nazario" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {'📻 Youtube Jumper 📻'}
        </h1>

        <p className={styles.description}>
          {'Please, don\'t stop the music!'}
        </p>

        <div className={styles.grid}>
          <div>
            <input
              name="youtubeurl"
              type="text"
              className={styles.urltext}
              placeholder="Youtube URL"
              onChange={(e) => onYoutubeUrlChange(e.target.value)}
              value={ytUrl}
              required
            />
            {ytUrl && <YouTube
              videoId={id}
              opts={youtubeOpts}
              onReady={onReady}
              onPlay={e => setVideoObj(e.target)}
              onStateChange={onStateChange} />}
          </div>

          <div>
            <div className={styles.tooltip}>
              Help, I need somebody!
              <span className={styles.tooltiptext}>
                {'Format: From -> To'}
                <br /><br />
                {'Example: 17:49 -> 25:50'}
                <br />
                {'(When video hits 17:49 time, it will automatically jump to 25:50)'}
                <br /><br />
                {'Add as many lines as you want :)'}
                <br /><br />
                {'Example:'}<br />
                {'17:49 -> 25:50 '}<br />
                {'44:18 -> 1:01:00'}
              </span>
            </div>
            <textarea
              name="intervals"
              className={styles.intervalsarea}
              placeholder="Intervals"
              onChange={onIntervalsChange}
              value={intervals}
              cols={30}
              rows={6}
            />
          </div>
          {id && <div className={styles.infoArea}>
            <div className={styles.button} onClick={onCaptureInterval}>
              {captureCaption}
            </div>
            {checkingIntervalsOnServer && <div>Checking server...</div>}
          </div>}
          {id && <input
            name="shareyoutubeurl"
            type="text"
            className={styles.urltext}
            placeholder="Share this video with your friends!"
            value={shareYtUrl}
            required
            readOnly
            onClick={() => {
              navigator.clipboard.writeText(shareYtUrl);
              alert('URL copied!');
            }}
          />}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/rrnazario/youtube-non-stop"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Rogim Nazário (Github)
        </a>
      </footer>
    </div>
  )
}
