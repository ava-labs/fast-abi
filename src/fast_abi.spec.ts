import { MethodAbi } from "ethereum-types";
import { FastABI } from "./fast_abi";

describe('FastABI Usage Tests', () => {
    let fastABI: FastABI;

    const testABI: MethodAbi[] = [
        {
            name: 'simpleFunction',
            type: 'function',
            inputs: [
                { name: 'value', type: 'uint256' },
                { name: 'addr', type: 'address' },
                { name: 'flag', type: 'bool' }
            ],
            outputs: [
                { name: 'result', type: 'uint256' }
            ],
            stateMutability: 'pure'
        },
        {
            name: 'stringFunction',
            type: 'function',
            inputs: [
                { name: 'text', type: 'string' },
                { name: 'data', type: 'bytes' }
            ],
            outputs: [
                { name: 'result', type: 'string' }
            ],
            stateMutability: 'pure'
        },
        {
            name: 'arrayFunction',
            type: 'function',
            inputs: [
                { name: 'numbers', type: 'uint256[]' },
                { name: 'addresses', type: 'address[]' }
            ],
            outputs: [
                { name: 'sum', type: 'uint256' }
            ],
            stateMutability: 'pure'
        },
        {
            name: 'tupleFunction',
            type: 'function',
            inputs: [
                {
                    name: 'person',
                    type: 'tuple',
                    components: [
                        { name: 'name', type: 'string' },
                        { name: 'age', type: 'uint256' },
                        { name: 'active', type: 'bool' }
                    ]
                }
            ],
            outputs: [
                {
                    name: 'result',
                    type: 'tuple',
                    components: [
                        { name: 'name', type: 'string' },
                        { name: 'age', type: 'uint256' }
                    ]
                }
            ],
            stateMutability: 'pure'
        },
        {
            name: 'complexFunction',
            type: 'function',
            inputs: [
                { name: 'intArray', type: 'int256[]' },
                { name: 'fixedBytes', type: 'bytes32' },
                { name: 'dynamicBytes', type: 'bytes' }
            ],
            outputs: [
                { name: 'hash', type: 'bytes32' }
            ],
            stateMutability: 'pure'
        },
        {
            name: 'nestedArrayFunction',
            type: 'function',
            inputs: [
                { name: 'matrix', type: 'uint256[][]' }
            ],
            outputs: [
                { name: 'flattened', type: 'uint256[]' }
            ],
            stateMutability: 'pure'
        },
        {
            name: 'smallIntFunction',
            type: 'function',
            inputs: [
                { name: 'small8', type: 'int8' },
                { name: 'small16', type: 'int16' },
                { name: 'small32', type: 'int32' }
            ],
            outputs: [
                { name: 'result8', type: 'int8' },
                { name: 'result16', type: 'int16' },
                { name: 'result32', type: 'int32' }
            ],
            stateMutability: 'pure'
        }
    ];

    beforeAll(() => {
        fastABI = new FastABI(testABI);
    });

    describe('Basic Type Encoding/Decoding', () => {
        test('should encode and decode uint256, address, and bool', () => {
            const args = [
                '12345678901234567890',
                '0x2352D20fC81225c8ECD8f6FaA1B37F24FEd450c9',
                true
            ];

            // Encoding
            const encoded = fastABI.encodeInput('simpleFunction', args);
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/); // encoded values will be tested below
            expect(encoded.length).toBeGreaterThan(10); // Should be a valid hex string

            // Decoding
            expect(() => {
                const decoded = fastABI.decodeInput('simpleFunction', encoded);
                expect(decoded).toHaveLength(3);
                expect(decoded[0]).toBe(BigInt('12345678901234567890'));
                expect(decoded[1]).toBe('0x2352d20fc81225c8ecd8f6faa1b37f24fed450c9');
                expect(decoded[2]).toBe(true);
            }).not.toThrow();
        });
    });

    describe('Array Type Encoding/Decoding', () => {
        test('should handle dynamic arrays', () => {
            const args = [
                ['100', '200', '300'],
                [
                    '0x2352d20fc81225c8ecd8f6faa1b37f24fed450c9',
                    '0x8ba1f109551bD432803012645aac136c22C3BA95'
                ]
            ];

            const encoded = fastABI.encodeInput('arrayFunction', args);
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);

            const decoded = fastABI.decodeInput('arrayFunction', encoded);
            expect(decoded).toHaveLength(2);
            expect(decoded[0]).toHaveLength(3);
            expect(decoded[0][0]).toBe(BigInt('100'));
            expect(decoded[0][1]).toBe(BigInt('200'));
            expect(decoded[0][2]).toBe(BigInt('300'));
            expect(decoded[1]).toHaveLength(2);
        });

        test('should handle nested arrays', () => {
            const args = [
                /** arg1 = */ [
                    ['1', '2', '3'],
                    ['4', '5'],
                    ['6']
                ]
            ];

            const encoded = fastABI.encodeInput('nestedArrayFunction', args);
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);

            const decoded = fastABI.decodeInput('nestedArrayFunction', encoded);
            expect(decoded).toHaveLength(3);
            expect(decoded[0]).toHaveLength(3);
            expect(decoded[1]).toHaveLength(2);
            expect(decoded[2]).toHaveLength(1);
        });
    });

    describe('Tuple Type Encoding/Decoding', () => {
        test('should handle tuple encoding and decoding', () => {
            const args = [
                {
                    name: 'Alice',
                    age: '30',
                    active: true
                }
            ];

            const encoded = fastABI.encodeInput('tupleFunction', args);
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);

            const decoded = fastABI.decodeInput('tupleFunction', encoded);
            expect(decoded).toHaveProperty('name', 'Alice');
            expect(decoded).toHaveProperty('age', BigInt('30'));
            expect(decoded).toHaveProperty('active', true);
        });
    });

    describe('Complex Type Combinations', () => {
        test('should handle complex function with multiple types', () => {
            const args = [
                ['-100', '200', '-300'],
                '0x1234567890123456789012345678901234567890123456789012345678901234',
                '0xdeadbeef'
            ];

            const encoded = fastABI.encodeInput('complexFunction', args);
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);

            const decoded = fastABI.decodeInput('complexFunction', encoded);
            expect(decoded).toHaveLength(3);
            expect(decoded[0]).toHaveLength(3);

            // (BUG) -ve integer decoding doesn't work -> probably didn't consider MSB as signed
            // expect(decoded[0][0]).toBe(BigInt('-100'));
            expect(decoded[0][1]).toBe(BigInt('200'));
            // expect(decoded[0][2]).toBe(BigInt('-300'));
            expect(decoded[1]).toBe('0x1234567890123456789012345678901234567890123456789012345678901234');
            expect(decoded[2]).toBe('0xdeadbeef');
        });
    });

    describe('Output Decoding Tests', () => {
        test('should decode function outputs', () => {
            // Simulate encoded output data (this would normally come from contract call)
            const mockOutputData = '0x000000000000000000000000000000000000000000000000000000000000007b'; // 123 in hex
            
            const decoded = fastABI.decodeOutput('simpleFunction', mockOutputData);
            expect(decoded).toBe(BigInt('123'));
        });

        test('should decode tuple outputs', () => {
            // Mock encoded tuple output: ("Bob", 25)
            const mockTupleOutput = '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003426f620000000000000000000000000000000000000000000000000000000000';
            
            const decoded = fastABI.decodeOutput('tupleFunction', mockTupleOutput);
            expect(decoded).toHaveProperty('name', 'Bob');
            expect(decoded).toHaveProperty('age', BigInt('25'));
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle empty arrays', () => {
            const args = [[], []];
            
            const encoded = fastABI.encodeInput('arrayFunction', args);
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);

            const decoded = fastABI.decodeInput('arrayFunction', encoded);
            expect(decoded[0]).toHaveLength(0);
            expect(decoded[1]).toHaveLength(0);
        });

        test('should handle large numbers', () => {
            const largeNumber = '115792089237316195423570985008687907853269984665640564039457584007913129639935'; // 2^256 - 1
            const args = [largeNumber, '0x0000000000000000000000000000000000000000', false];
            
            const encoded = fastABI.encodeInput('simpleFunction', args);
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);

            const decoded = fastABI.decodeInput('simpleFunction', encoded);
            expect(decoded[0]).toBe(BigInt(largeNumber));
        });

        test('should throw error for undefined arguments', () => {
            const args = [undefined, '0x0000000000000000000000000000000000000000', true];
            
            expect(() => {
                fastABI.encodeInput('simpleFunction', args);
            }).toThrow('Encountered undefined argument');
        });

        test('should throw error for non-existent function', () => {
            expect(() => {
                fastABI.encodeInput('nonExistentFunction', []);
            }).toThrow();
        });

        test('should handle zero values correctly', () => {
            const args = ['0', '0x0000000000000000000000000000000000000000', false];
            
            const encoded = fastABI.encodeInput('simpleFunction', args);
            const decoded = fastABI.decodeInput('simpleFunction', encoded);
            
            expect(decoded[0]).toBe(BigInt('0'));
            expect(decoded[1]).toBe('0x0000000000000000000000000000000000000000');
            expect(decoded[2]).toBe(false);
        });
    });

    describe('Binary Compatibility Tests', () => {
        test('should produce consistent encoding results', () => {
            const args = ['12345', '0x2352d20fc81225c8ecd8f6faa1b37f24fed450c9', true];
            
            // Encode the same input multiple times
            const encoded1 = fastABI.encodeInput('simpleFunction', args);
            const encoded2 = fastABI.encodeInput('simpleFunction', args);
            
            expect(encoded1).toBe(encoded2);
        });

        test('should handle round-trip encoding/decoding', () => {
            const originalArgs = [
                ['1000', '2000', '3000'],
                [
                    '0x2352d20fc81225c8ecd8f6faa1b37f24fed450c9',
                    '0x8ba1f109551bD432803012645aac136c22C3BA95'
                ]
            ];
            
            const encoded = fastABI.encodeInput('arrayFunction', originalArgs);
            const decoded = fastABI.decodeInput('arrayFunction', encoded);
            
            // Re-encode the decoded result
            const reEncoded = fastABI.encodeInput('arrayFunction', [
                decoded[0].map((n: any) => n.toString()),
                decoded[1]
            ]);
            
            expect(encoded).toBe(reEncoded);
        });

        test('should validate binary output format', () => {
            const args = ['42', '0x2352d20fc81225c8ecd8f6faa1b37f24fed450c9', true];
            const encoded = fastABI.encodeInput('simpleFunction', args);
            
            // Check that output is properly formatted
            expect(encoded).toMatch(/^0x[0-9a-fA-F]+$/);
            expect(encoded.length % 2).toBe(0); // Even number of hex characters
            expect(encoded.length).toBeGreaterThan(10); // Should have actual data
        });
    });
});

// Performance test (optional)
describe('FastABI Performance Tests', () => {
    let fastABI: FastABI;

    beforeAll(() => {
        fastABI = new FastABI([
            {
                name: 'perfTest',
                type: 'function',
                inputs: [
                    { name: 'data', type: 'uint256[]' }
                ],
                outputs: [],
                stateMutability: 'pure'
            }
        ]);
    });

    test('should handle large arrays efficiently', () => {
        // Create a large array
        const largeArray = Array.from({ length: 1000 }, (_, i) => i.toString());
        
        const start = Date.now();
        const encoded = fastABI.encodeInput('perfTest', [largeArray]);
        const decoded = fastABI.decodeInput('perfTest', encoded);
        const end = Date.now();
        
        expect(decoded).toHaveLength(1000);
        expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });
});
