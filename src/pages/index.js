import Head from 'next/head'
import styles from '../styles/Home.module.css'
import YouTube from 'react-youtube'
import { useState } from 'react'
import Interval from '../components/interval/index-interval';

export default function Home() {
  const [id, setId] = useState();
  const [ytUrl, setYtUrl] = useState();
  const [intervals, setIntervals] = useState();
  const [intervalArray, setIntervalArray] = useState([]);
  const [loop, setLoop] = useState();

  const onReady = async (e) => {

    e.target.pauseVideo();
  }

  const onYoutubeUrlChange = (e) => {
    setYtUrl(e.target.value);
    console.log(e.target.value);

    const youtubeUrls = ["youtu.be/", "youtube.com/watch?v="]
    let localId = "";

    youtubeUrls.forEach(url => {
      const ytindex = e.target.value.indexOf(url);
      if (ytindex >= 0) {
        localId = e.target.value.substring(ytindex + url.length);
        return;
      }
    });

    if (!localId) {
      clearInterval(loop);
      setLoop(null);
    }

    console.log(localId);
    setId(localId);
  }

  const onIntervalsChange = (e) => {
    //17:49 -> 25:50
    //44:18 -> 1:01:00
    const localArray = []

    e.target.value.split("\n").forEach(line => {
      const newInterval = Interval(line);
      if (isValidInterval(newInterval))
        localArray = [...localArray, newInterval];
    })

    setIntervalArray(localArray);
    setIntervals(e.target.value);
  }

  const isValidInterval = (interval) => {
    const begin = interval.Begin();
    const end = interval.End();
    const valid = begin < end && end > 0;

    //console.log(`Valid? ${valid}`);
    return valid;
  }

  const onStateChange = async (e) => {
    console.log(e);

    if (id && e.data === 1 && !loop) {
      await setLoop(setInterval((video, arrIntervals) => {
        
        arrIntervals.forEach(inter => {
          const currTime = video.getCurrentTime();
          console.log(`Curr: ${currTime}, Begin ${inter.Begin()}, End: ${inter.End()}`)

          if (inter.Begin() <= currTime && inter.End() > currTime) {
            console.log(`Changing ${inter.Begin()}`)
            e.target.loadVideoById(id, inter.End());
            
            return;
          }
        });

      }, 1000, e.target, intervalArray));
    }
  }

  const opts = {    
    width: '100%',
    playerVars: {
      autoplay: 1,
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
          📻 Youtube Jumper 📻
        </h1>

        <p className={styles.description}>
          Please, don't stop the music!
        </p>

        <div className={styles.grid}>
          <div>
            <input
              name="youtubeurl"
              type="text"
              className={styles.urltext}
              placeholder="Youtube URL"
              onChange={onYoutubeUrlChange}
              value={ytUrl}
              required
            />
            {ytUrl && <YouTube
              videoId={id}
              opts={opts}
              onReady={onReady}
              onStateChange={onStateChange} />}
          </div>

          <div>
            <div className={styles.tooltip}>
              Help, I need somebody!
              <span className={styles.tooltiptext}>
                Format: From -> To
                <br /><br />
                Example: 17:49 -> 25:50
                <br />
                (When video hits 17:49 time, it will automatically jump to 25:50)
                <br /><br />
                Add as many lines as you want :)
                <br /><br />
                Example:<br />
                17:49 -> 25:50 <br />
                44:18 -> 1:01:00
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
