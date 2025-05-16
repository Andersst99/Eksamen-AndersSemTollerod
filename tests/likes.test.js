const { isLikedAlready } = require("../js/utils");

describe("isLikedAlready", () => {
  const existingLikes = [
    { likedUser: { name: "Anna", age: 28 } },
    { likedUser: { name: "Per", age: 32 } },
  ];

  it("skal returnere true hvis brukeren allerede er likt", () => {
    expect(isLikedAlready(existingLikes, { name: "Anna", age: 28 })).toBe(true);
  });

  it("skal returnere false hvis brukeren ikke er likt enda", () => {
    expect(isLikedAlready(existingLikes, { name: "Ola", age: 30 })).toBe(false);
  });
});
