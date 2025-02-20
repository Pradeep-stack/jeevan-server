export const generateId = () => {
    const now = new Date();
    return Number(
        `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}`
    );
};

// console.log(generateId()); // Example: 2502201345 (YYMMDDHHMM)
