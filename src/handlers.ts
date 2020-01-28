function toBool(input: string): boolean | undefined {
  try {
    return JSON.parse(input);
  }
  catch (e) {
    return undefined;
  }
}

function randNumBetween(min: number, max: number):number { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export { toBool, randNumBetween };