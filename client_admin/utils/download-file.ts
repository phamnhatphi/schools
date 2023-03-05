const downloadFile = (data: Blob, filename: string) => {
    const fileURL = window.URL.createObjectURL(data);
    const fileLink = document.createElement('a');

    fileLink.href = fileURL;
    fileLink.setAttribute('download', filename);
    document.body.appendChild(fileLink);

    fileLink.click();
};

export default downloadFile;
