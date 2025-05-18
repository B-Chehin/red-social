export const SerializeForm = (target) => {
    const formData = new FormData(target);
    const data = {};
    for(let [key, value] of formData) {
        data[key] = value;
    }
    return data;
}
