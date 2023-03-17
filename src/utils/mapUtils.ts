// TODO is there some other types of intended use?
export const mapObjectValueByIntendedUse = (value: any, intendedUse: string) => {
  switch (intendedUse) {
    case 'Percentage':
      return `${(parseFloat(value) * 100)}%`
    default:
      return value;
  }
}