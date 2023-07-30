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

    const isFormatted = raw.indexOf("->") !== -1;

    const begin = () => {
        if (!isFormatted)
            return 0;
        //raw: 44:18 -> 1:01:00
        const str = raw.split("->")[0] //44:18;

        return calcTime(str);
    }

    const end = () => {
        if (!isFormatted)
            return 0;

        const str = raw.split("->")[1] //44:18;

        return calcTime(str);
    }

    const isValid = () => {
        if (!isFormatted) return false;

        const bg = begin();
        const ed = end();
        return bg < ed && ed > 0;
    }

    const stringify = () => {
        if (raw.indexOf(':') === -1) {
            const firstPart = extractIntervalPartFromFloat(raw.split("->")[0]);
            const secondPart = extractIntervalPartFromFloat(raw.split("->")[1]);

            return `${firstPart} -> ${secondPart}`;
        }

        return raw;
    }

    const extractIntervalPartFromFloat = (strFloat) => {
        const floatInterval = parseFloat(strFloat);

        const floatPart = parseInt(floatInterval % 60);
        const intPart = parseInt(floatInterval / 60);

        return `${intPart}:${floatPart}`
    }

    return {
        Begin: () => begin(),
        End: () => end(),
        Stringify: () => stringify(),
        IsValid: isValid()
    }
}

export default Interval;