import * as path from "jsr:@std/path";

const getInput = () => Deno.readTextFile(path.resolve(import.meta.dirname ?? "", "input.txt"));
type FormattedInput = [number[], number[]];

export function getDistance(input: FormattedInput) {
    const left = input[0].toSorted((a, b) => a - b), right = input[1].toSorted((a, b) => a - b);
    let result = 0;
    for (let i = 0; i < left.length; i++) {
        result += Math.abs((left[i] ?? 0) - (right[i] ?? 0));
    }
    return result;
}

export function getSimilarity(input: FormattedInput) {
    const left = input[0], right = input[1];
    const counts = new Map<number, number>();
    right.forEach((val) => counts.set(val, (counts.get(val) ?? 0) + 1));
    let result = 0;

    for (const item of left) {
        result += item * (counts.get(item) ?? 0);
    }

    return result;
}

export function format(input: string) {
    return input
    .replaceAll("\n", "   ")
    .split("   ")
    .reduce<FormattedInput>((list, current, idx) => {
        if (current?.length) {
            list[idx % 2].push(Number(current));
        }
        return list;
    }, [[], []]);
}

export async function partOne() {
    const input = format(await getInput());
    console.log(getDistance(input));
}

export async function partTwo() {
    const input = format(await getInput());
    console.log(getSimilarity(input));
}

if (import.meta.main) {
    partOne();
    partTwo();
}

Deno.bench("day-one-part-one", { permissions: "inherit" }, async (b) => {
    const file = await getInput();
    const input = format(file)
    b.start();
    getDistance(input);
    b.end();
});

Deno.bench("day-one-part-two", { permissions: "inherit" }, async (b) => {
    const file = await getInput();
    const input = format(file)
    b.start();
    getSimilarity(input);
    b.end();
});