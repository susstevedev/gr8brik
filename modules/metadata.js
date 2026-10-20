let metadata;

await fetch('metadata.json')
    .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(data => {
        metadata = structuredClone(data);
        console.log(metadata);
    })
    .catch(error => console.error(error));

export default metadata;