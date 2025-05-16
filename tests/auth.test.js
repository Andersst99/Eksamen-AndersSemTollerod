const { validateUser } = require("../js/utils");

describe("validateUser", () => {
  it("skal returnere true for gyldig brukernavn og passord", () => {
    expect(validateUser("Anders", "123456")).toBe(true);
  });

  it("skal returnere false for tomt brukernavn", () => {
    expect(validateUser("", "123456")).toBe(false);
  });

  it("skal returnere false for tomt passord", () => {
    expect(validateUser("Anders", "")).toBe(false);
  });

  it("skal returnere false for for kort passord", () => {
    expect(validateUser("Anders", "123")).toBe(false);
  });
});
