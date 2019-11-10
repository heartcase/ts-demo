import App from "..";
import { shallow } from "enzyme";
import React from "react";

describe("Test App", () => {
  test("", () => {
    const wrapper = shallow(<App appName={"myApp"} />);
    expect(wrapper).toMatchSnapshot();
  });
});
