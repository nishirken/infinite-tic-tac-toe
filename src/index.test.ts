import { defaultState, move, Player, compose, getDiagonalPoint, getCoDiagonalPoint } from ".";

describe('Infinite tic-tac toe', () => {
    test.each([
        [[{x: 1, y: 1}, {x: 4, y: 4}, {x: -3, y: -3}], {x: 0, y: 0}],
        [[{x: 3, y: 2}, {x: 1, y: 0}, {x: -1, y: -2}, {x: 5, y: 4}], {x: 0, y: -1}],
    ])('Diagonal point', (points, expected) => {
        for (const point of points) {
            expect(getDiagonalPoint(point)).toEqual(expected);
        }
    });

    test.each([
        [[{x: 1, y: -1}, {x: -1, y: 1}, {x: 2, y: -2}], {x: 0, y: 0}],
        [[{x: 3, y: 2}, {x: 6, y: -1}, {x: -1, y: 6}], {x: 0, y: 5}],
    ])('CoDiagonal point', (points, expected) => {
        for (const point of points) {
            expect(getCoDiagonalPoint(point)).toEqual(expected);
        }
    });

    describe('Basic with n = 2', () => {
        /**
         * |X|0|
         * |X| |
         */
        test('First won by cols', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 1, y: 0}, Player.Second),
                move({x: 0, y: 1}, Player.First),
            )(state);
    
            expect(res.winner).toBe(Player.First);
        });

        /**
         * |X|X|
         * |0| |
         */
         test('First won by rows', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 0, y: 1}, Player.Second),
                move({x: 1, y: 0}, Player.First),
            )(state);
    
            expect(res.winner).toBe(Player.First);
        });

        /**
         * |X| |
         * |0|X|
         */
         test('First won by diagonal', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 0, y: 1}, Player.Second),
                move({x: 1, y: 1}, Player.First),
            )(state);
    
            expect(res.winner).toBe(Player.First);
        });

        /**
         * |0|X|
         * |X| |
         */
         test('First won by codiagonal', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 1, y: 0}, Player.First),
                move({x: 0, y: 0}, Player.Second),
                move({x: 0, y: 1}, Player.First),
            )(state);
    
            expect(res.winner).toBe(Player.First);
        });
    });

    describe('Basic with n = 3', () => {
        /**
         * |X|X|0|
         * |X|0|0|
         * |X| | |
         */
        test('The first player won by rows', () => {
            const state = { ...defaultState, n: 3 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 1, y: 1}, Player.Second),
                move({x: 1, y: 0}, Player.First),
                move({x: 2, y: 0}, Player.Second),
                move({x: 0, y: 2}, Player.First),
                move({x: 2, y: 1}, Player.Second),
                move({x: 0, y: 1}, Player.First),
            )(state);

            expect(res.winner).toBe(Player.First);
        });

        /**
         * |X|0|X|
         * |0|0|0|
         * |X|X| |
         */
        test('The second player won by cols', () => {
            const state = { ...defaultState, n: 3 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 1, y: 0}, Player.Second),
                move({x: 2, y: 0}, Player.First),
                move({x: 0, y: 1}, Player.Second),
                move({x: 0, y: 2}, Player.First),
                move({x: 1, y: 1}, Player.Second),
                move({x: 1, y: 2}, Player.First),
                move({x: 2, y: 1}, Player.Second),
            )(state);

            expect(res.winner).toBe(Player.Second);
        });

        /**
         * |X|0| |
         * | |X| |
         * | |0|X|
         */
         test('The first player won by diagonal', () => {
            const state = { ...defaultState, n: 3 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 1, y: 0}, Player.Second),
                move({x: 1, y: 1}, Player.First),
                move({x: 1, y: 2}, Player.Second),
                move({x: 2, y: 2}, Player.First),
            )(state);

            expect(res.winner).toBe(Player.First);
        });

        /**
         * |X|X|0|
         * | |0| |
         * |0| |X|
         */
         test('The second player won by codiagonal', () => {
            const state = { ...defaultState, n: 3 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: -1, y: -1}, Player.Second),
                move({x: -2, y: -2}, Player.First),
                move({x: 0, y: -2}, Player.Second),
                move({x: -1, y: -2}, Player.First),
                move({x: -2, y: 0}, Player.Second),
            )(state);

            expect(res.winner).toBe(Player.Second);
        });
    });

    describe('Infinite board', () => {
        /**
         * |X|0|X| |
         * | | | | |
         * | |0|X|X|
         * | | | |0|
         */
        test('First won by rows', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 1, y: 0}, Player.Second),
                move({x: 2, y: 0}, Player.First),
                move({x: 1, y: 2}, Player.Second),
                move({x: 2, y: 2}, Player.First),
                move({x: 3, y: 3}, Player.Second),
                move({x: 3, y: 2}, Player.First),
            )(state);

            expect(res.winner).toBe(Player.First);
        });

        /**
         * |X|0|X| |
         * | | | | |
         * | |0|X|X|
         * | | | |0|
         */
         test('First won by rows, negative coords', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: -1, y: 0}, Player.Second),
                move({x: 1, y: 0}, Player.First),
                move({x: 1, y: 1}, Player.Second),
                move({x: -2, y: -2}, Player.First),
                move({x: -1, y: -2}, Player.Second),
                move({x: 0, y: -2}, Player.First),
            )(state);

            expect(res.winner).toBe(Player.First);
        });

        /**
         * |X|0|X| |
         * | | | | |
         * |X|0|X|0|
         * | | | |0|
         */
         test('Second won by cols', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 1, y: 0}, Player.Second),
                move({x: 2, y: 0}, Player.First),
                move({x: 1, y: 2}, Player.Second),
                move({x: 0, y: 2}, Player.First),
                move({x: 3, y: 2}, Player.Second),
                move({x: 2, y: 2}, Player.First),
                move({x: 3, y: 3}, Player.Second),
            )(state);

            expect(res.winner).toBe(Player.Second);
        });

        /**
         * |X|0|X| |
         * | | | | |
         * |X|0|X|0|
         * | | | |0|
         */
         test('Second won by cols, negative coords', () => {
            const state = { ...defaultState, n: 2 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: -1, y: 0}, Player.Second),
                move({x: -2, y: 0}, Player.First),
                move({x: 1, y: 0}, Player.Second),
                move({x: -2, y: -2}, Player.First),
                move({x: -1, y: -2}, Player.Second),
                move({x: 0, y: -2}, Player.First),
                move({x: 1, y: 1}, Player.Second),
            )(state);

            expect(res.winner).toBe(Player.Second);
        });

        /**
         * |X|0| |0|0| |
         * | |X| | | | |
         * | |0| | | | |
         * | | | |X| | |
         * | | | | |X| |
         * | | | | | |X|
         */
         test('First won by diagonal', () => {
            const state = { ...defaultState, n: 3 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 1, y: 0}, Player.Second),
                move({x: 1, y: 1}, Player.First),
                move({x: 1, y: 2}, Player.Second),
                move({x: 3, y: 3}, Player.First),
                move({x: 3, y: 0}, Player.Second),
                move({x: 5, y: 5}, Player.First),
                move({x: 4, y: 0}, Player.Second),
                move({x: 4, y: 4}, Player.First),
            )(state);

            expect(res.winner).toBe(Player.First);
        });

        /**
         * |X|X| | | |0|
         * | |X| | |0| |
         * | | | | | | |
         * | | |0|X| | |
         * | |0| | | | |
         * |0| | | | |X|
         */
         test('Second won by coDiagonal', () => {
            const state = { ...defaultState, n: 3 };
            const res = compose(
                move({x: 0, y: 0}, Player.First),
                move({x: 5, y: 0}, Player.Second),
                move({x: 1, y: 1}, Player.First),
                move({x: 4, y: 1}, Player.Second),
                move({x: 1, y: 0}, Player.First),
                move({x: 0, y: 5}, Player.Second),
                move({x: 3, y: 3}, Player.First),
                move({x: 2, y: 3}, Player.Second),
                move({x: 5, y: 5}, Player.First),
                move({x: 1, y: 4}, Player.Second),
            )(state);

            expect(res.winner).toBe(Player.Second);
        });
    });
});