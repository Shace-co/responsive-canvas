
export  const isRoom = (object) => {
    return object.id !== "workspace" && object.type !== "image";
};

export  const getTheJson = async (url) => {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load JSON file:", error);
    }
};
