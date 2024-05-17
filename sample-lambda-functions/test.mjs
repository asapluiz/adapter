export const handler = async (event) => {
    // You can construct your JSON response here
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            // more data here
        }),
    };

    return response;
};
