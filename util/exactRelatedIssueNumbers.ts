export const exactRelatedIssueNumbers = (body: string | null): number[] => {
  return (body?.match(/#[0-9]+/g) || []).map((str) =>
    Number.parseInt(str.slice(1)),
  );
};
