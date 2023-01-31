import {getMsFromMinutes} from "./timeFormatter";

const msBaseline = 60000;

describe("getMsFromMinutes", () => {
  it.each`
    ms                 | min
    ${0}               | ${0}
    ${msBaseline}      | ${1}
    ${msBaseline * 2}  | ${2}
    ${msBaseline * 30} | ${30}
  `('should convert $ms ms into $min min(s)', ({ms, min}) => {
    expect(getMsFromMinutes(min)).toEqual(ms);
  });
});