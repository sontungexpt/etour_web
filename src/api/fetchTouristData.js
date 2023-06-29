// Define a function that takes two parameters and returns their sum
function addNumbers(num1, num2) {
    return num1 + num2;
}

// Define a variable with a string value
let greeting = 'Hello, World!';

// Define an object with several properties
let person = {
    name: 'John',
    age: 30,
    isEmployed: true,
    hobbies: ['reading', 'playing guitar', 'hiking'],
};

// Define an array of numbers
let numbers = [1, 2, 3, 4, 5];

// Use a for loop to iterate over the array and log each number to the console
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

// Define a class for creating rectangles
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    get area() {
        return this.width * this.height;
    }
}

// Create a new instance of the Rectangle class and log its area to the console
let rect = new Rectangle(5, 10);
console.log(rect.area);

// Define a function that takes an array and returns its sum
function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// Use the sumArray function to calculate the sum of the numbers array and log it to the console
console.log(sumArray(numbers));

// Define a function that takes a string and returns its length
function stringLength(str) {
    return str.length;
}

// Use the stringLength function to log the length of the greeting variable to the console
console.log(stringLength(greeting));

// Define a function that takes an object and returns its keys
function objectKeys(obj) {
    return Object.keys(obj);
}

// Use the objectKeys function to log the keys of the person object to the console
console.log(objectKeys(person));

// Define a function that takes a number and returns a boolean indicating whether it is even
function isEven(num) {
    return num % 2 === 0;
}

// Use the isEven function to log whether each number in the numbers array is even or odd to the console
for (let i = 0; i < numbers.length; i++) {
    if (isEven(numbers[i])) {
        console.log(`${numbers[i]} is even.`);
    } else {
        console.log(`${numbers[i]} is odd.`);
    }
}

// Define a function that takes a string and returns it reversed
function reverseString(str) {
    return str.split('').reverse().join('');
}

// Use the reverseString function to log the reversed greeting to the console
console.log(reverseString(greeting));

// Define a function that takes an array and returns a new array with all the values doubled
function doubleArray(arr) {
    let doubled = [];
    for (let i = 0; i < arr.length; i++) {
        doubled.push(arr[i] * 2);
    }
    return doubled;
}

// Use the doubleArray function to log a new array with all the values in the numbers array doubled to the console
console.log(doubleArray(numbers));

// Define a function that takes a number and returns its factorial
function factorial(num) {
    if (num === 0) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

// Use the factorial function to log the factorial of 5 to the console
console.log(factorial(5));

// Define a function that takes an array and a value and returns the index of the first occurrence of the value in the array, or -1 if it is not found
function indexOf(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            return i;
        }
    }
    return -1;
}

// Use the indexOf function to log the index of the number 3 in the numbers array to the console
console.log(indexOf(numbers, 3));

// Define a function that takes an array of strings and returns the longest string
function longestString(arr) {
    let longest = '';
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > longest.length) {
            longest = arr[i];
        }
    }
    return longest;
}

// Use the longestString function to log the longest hobby in the person object to the console
console.log(longestString(person.hobbies));

// Define a function that takes an array of numbers and returns a new array with only the even numbers
function filterEven(arr) {
    let even = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) {
            even.push(arr[i]);
        }
    }
    return even;
}

// Use the filterEven function to log a new array with only the even numbers from the numbers array to the console
console.log(filterEven(numbers));

// Define a function that takes a string and a character and returns the number of times the character appears in the string
function countChar(str, char) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char) {
            count++;
        }
    }
    return count;
}

// Use the countChar function to log the number of times the letter "l" appears in the greeting to the console
console.log(countChar(greeting, 'l'));

// Define a function that takes an array of numbers and returns the average value
function average(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

// Use the average function to log the average value of the numbers array to the console
console.log(average(numbers));

// Define a function that takes a string and returns whether it is a palindrome (reads the same forwards and backwards)
function isPalindrome(str) {
    let reversed = str.split('').reverse().join('');
    return str === reversed;
}

// Use the isPalindrome function to log whether the greeting is a palindrome to the console
console.log(isPalindrome(greeting));

// Define a function that takes an array of strings and returns a new array with all the strings capitalized
function capitalizeArray(arr) {
    let capitalized = [];
    for (let i = 0; i < arr.length; i++) {
        capitalized.push(arr[i].toUpperCase());
    }
    return capitalized;
}

// Use the capitalizeArray function to log a new array with all the hobbies in the person object capitalized to the console
console.log(capitalizeArray(person.hobbies));

// Define a function that takes a number and returns a boolean indicating whether it is prime
function isPrime(num) {
    if (num <= 1) {
        return false;
    }
    for (let i = 2; i < num; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

// Use the isPrime function to log whether each number in the numbers array is prime or not to the console
for (let i = 0; i < numbers.length; i++) {
    if (isPrime(numbers[i])) {
        console.log(`${numbers[i]} is prime.`);
    } else {
        console.log(`${numbers[i]} is not prime.`);
    }
}

// Define a function that takes an array of numbers and returns a new array with only the unique values
function uniqueArray(arr) {
    let unique = [];
    for (let i = 0; i < arr.length; i++) {
        if (!unique.includes(arr[i])) {
            unique.push(arr[i]);
        }
    }
    return unique;
}

// Use the uniqueArray function to log a new array with only the unique values from the numbers array to the console
console.log(uniqueArray(numbers));

// Define a function that takes a string and returns it with all the vowels removed
function removeVowels(str) {
    return str.replace(/[aeiou]/gi, '');
}

// Use the removeVowels function to log the greeting with all the vowels removed to the console
console.log(removeVowels(greeting));

// Define a function that takes an array of strings and returns the shortest string
function shortestString(arr) {
    let shortest = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length < shortest.length) {
            shortest = arr[i];
        }
    }
    return shortest;
}

// Use the shortestString function to log the shortest hobby in the person object to the console
console.log(shortestString(person.hobbies));

// Define a function that takes a number and returns its binary representation as a string
function decimalToBinary(num) {
    return (num >>> 0).toString(2);
}

// Use the decimalToBinary function to log the binary representation of the number 10 to the console
console.log(decimalToBinary(10));

// Define a function that takes an array of numbers and returns the product of all the values
function product(arr) {
    let product = 1;
    for (let i = 0; i < arr.length; i++) {
        product *= arr[i];
    }
    return product;
}

// Use the product function to log the product of the numbers array to the console
console.log(product(numbers));

// Define a function that takes a string and returns whether it is a
