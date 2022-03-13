import Interval from "./interval";

test("Convert interval begin successfully", () => {
    const interval = Interval("17:49 -> 25:50")
    
    expect(interval.Begin()).toBe(1069)
})

test("Convert interval end successfully", () => {
    const interval = Interval("17:49 -> 25:50")
    
    expect(interval.End()).toBe(1550)
})