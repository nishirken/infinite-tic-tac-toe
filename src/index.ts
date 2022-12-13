type Point = { x: number; y: number };

export enum Player {
    First = 1,
    Second = -1,
}

export type Action = { type: "Move", payload: Point };

export type Winner = Player | 0;

/**
 * The "rows" object will be enough for restoring from serialized string. Others can be calculated from it, if we care about memory in storage.
 */
export type State = {
    rows: Record<number, Record<number, number>>; 
    cols: Record<number, Record<number, number>>;
    diagonals: Record<string, Record<number, number>>;
    coDiagonals: Record<string, Record<number, number>>;
    winner: Winner;
    currentPlayer: Player;
    n: number; // winnable condition
};

export const compose = <T>(...fns: ((x: T) => T)[]) => (x: T) => fns.reduce((y, f) => f(y), x); 

export const defaultState: State = {
    rows: {},
    cols: {},
    diagonals: {},
    coDiagonals: {},
    winner: 0,
    currentPlayer: Player.First,
    n: 5,
};

export const getDiagonalPoint = (point: Point): Point => {
    return {x: 0, y: point.y - point.x};
};

export const getCoDiagonalPoint = (point: Point): Point => {
    return {x: 0, y: point.x + point.y};
};

const pointToString = ({x, y}: Point): string => {
    return `${x},${y}`;
};

/**
 * Couting for a row, a column or any diagonal works in the similar way
 * There are four possible situations in any direction
 * C - current player, consider it == 1. Otherwise counter = 1
 * XXCXX - if C == 1, then counter = 5
 * --CXX - if C == 1, then counter = 3
 * XXC-- - if C == 1, then counter = 3
 * --C-- - counter = 1
 */
const count = (xs: Record<number, number>, initialCoord: number, player: Player): number => {
    let l = initialCoord;
    let r = initialCoord;
    let leftCounter = 0;
    let rightCounter = 0;

    while (xs[l] === player) {
        leftCounter++;
        l--;
    }

    while (xs[r] === player) {
        rightCounter++;
        r++;
    }

    return leftCounter + rightCounter - 1;
};

export const move = (point: Point, player: Player) => (prevState: State): State => {
    const newState = { ...prevState };
    newState.rows = { ...prevState.rows };
    newState.cols = { ...prevState.cols };
    newState.diagonals = { ...prevState.diagonals };
    newState.coDiagonals = { ...prevState.coDiagonals };
    const {rows, cols, diagonals, coDiagonals} = newState;
    const diagonalPoint = getDiagonalPoint(point);
    const coDiagonalPoint = getCoDiagonalPoint(point);

    if (rows[point.y] === undefined) {
        rows[point.y] = {[point.x]: player};
    }

    if (cols[point.x] === undefined) {
        cols[point.x] = {[point.y]: player};
    }

    if (diagonals[pointToString(diagonalPoint)] === undefined) {
        diagonals[pointToString(diagonalPoint)] = {[point.x]: player};
    }

    if (coDiagonals[pointToString(coDiagonalPoint)] === undefined) {
        coDiagonals[pointToString(coDiagonalPoint)] = {[point.x]: player};
    }

    const currentRow = rows[point.y];
    currentRow[point.x] = player;
    const rowsCounter = count(currentRow, point.x, player);

    if (rowsCounter === prevState.n) {
        return {
            ...newState,
            winner: player,
        };
    }
    
    const currentCol = cols[point.x];
    currentCol[point.y] = player;
    const colsCounter = count(currentCol, point.y, player);

    if (colsCounter === prevState.n) {
        return {
            ...newState,
            winner: player,
        };
    }

    const currentDiagonal = diagonals[pointToString(diagonalPoint)];
    currentDiagonal[point.x] = player;
    const diagonalCounter = count(currentDiagonal, point.x, player);

    if (diagonalCounter === prevState.n) {
        return {
            ...newState,
            winner: player,
        };
    }

    const currentCoDiagonal = coDiagonals[pointToString(coDiagonalPoint)];
    currentCoDiagonal[point.x] = player;
    const coDiagonalCounter = count(currentCoDiagonal, point.x, player);

    if (coDiagonalCounter === prevState.n) {
        return {
            ...newState,
            winner: player,
        };
    }

    return newState;
};

const isCurrentPointExists = (state: State, point: Point): boolean => {
    return state.rows[point.y] && state.rows[point.y][point.x] !== undefined;
};

export const reducer = (prevState: State = defaultState, action: Action): State => {
    switch (action.type) {
        case "Move":
            if (isCurrentPointExists(prevState, action.payload)) {
                return prevState; // do nothing or show error
            }

            const current = prevState.currentPlayer;
            const nextPlayer = current === Player.First ? Player.Second : Player.First;

            return move(action.payload, nextPlayer)(prevState);
        default:
            return prevState;
    }
};