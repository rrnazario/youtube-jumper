const Interval = (text) => {
    const raw = text;

    const calcTime = (line) => {
        if (!line || line === "") return 0;

        const splitted = line.split(":") //[44, 18];

        if (!splitted || splitted.length < 2) return 0;

        let totalTime = 0;

        for (let index = 0; index < splitted.length; index++) {
            totalTime += Math.pow(60, splitted.length - index - 1) * parseInt(splitted[index].trim());
        }

        return totalTime;
    }

    return {
        Begin: () => {
            //raw: 44:18 -> 1:01:00
            const str = raw.split("->")[0] //44:18;

            return calcTime(str);
        },
        End: () => {
            const str = raw.split("->")[1] //44:18;

            return calcTime(str);
        },
    }
}

export default Interval;