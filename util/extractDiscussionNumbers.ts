export const extractDiscussionNumbers = (body: string | null): number[] => {
  return (
    body?.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/discussions\/[0-9]+/g) ||
    []
  ).map((url) => {
    const parts = url.split("/");
    const lastPart = parts.pop();
    return lastPart ?? Number.parseInt(lastPart);
  });
};
