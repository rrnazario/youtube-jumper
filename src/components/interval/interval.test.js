import Interval from "./interval";

test("Convert interval begin successfully", () => {
    const interval = Interval("17:49 -> 25:50")
    
    expect(interval.Begin()).toBe(1069)
})

test("Convert interval end successfully", () => {
    const interval = Interval("17:49 -> 25:50")
    
    expect(interval.End()).toBe(1550)
})

test("given an interval with invalid value on begin, then returns should be 0", () => {
    const interval = Interval("a -> 25:50")
    
    expect(interval.Begin()).toBe(0)
})

test("given an interval with invalid value on separator, then returns 0", () => {
    const interval = Interval("17:49 ||| 25:50")
    
    expect(interval.Begin()).toBe(0)
    expect(interval.End()).toBe(0)
})