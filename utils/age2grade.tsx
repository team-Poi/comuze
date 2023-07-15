export default function age2grade(age: number) {
  if (age < 14) return age - 7;
  if (age < 17) return age - 13;
  return age - 16;
}
