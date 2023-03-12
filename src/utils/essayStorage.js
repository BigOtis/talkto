// get the essays from the local storage
export const getEssays = () => {
    let essays = localStorage.getItem('essays');
    if (essays) {
        return JSON.parse(essays);
    }
    localStorage.setItem('essays', JSON.stringify([]));
    return [];
}
// save the essay to the local storage
export const saveEssay = (title, prompt, output) => {
    const essays = getEssays();
    essays.push({title, prompt, output});
    localStorage.setItem('essays', JSON.stringify(essays));
}

// delete the essay from the local storage
export const deleteEssay = (title) => {
    const essays = getEssays();
    const newEssays = essays.filter(essay => essay.title !== title);
    localStorage.setItem('essays', JSON.stringify(newEssays));
}

