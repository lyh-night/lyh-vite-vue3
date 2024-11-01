package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"testing"
)

var pool = make(chan struct{}, 2)

var token = "Bearer smartvision5b9416ffe418e99b9d378fd9ef3ce6c82f2cf3625dbf9118e5781f1e721cdb20f48b8f9a20bb1f34d5847c2cc8a3bb4f7bcd83d7b179f9a1026d1fbc15e2f329475803b77fc48ce0bc02052ddcd5185a07ed0aab0785653ab9d0d86b8ee70f101527441a36e0d5a931d05dc89e1c63b8"

func TestUpload(t *testing.T) {
	var filename = "smartvision-upgrade-20240905151332.tar.gz"
	//var fielDir = "D:/project/smartvision"
	var fielDir = "D:/project"
	filePath := filepath.Join(fielDir, filename)
	t.Log(filePath)
	file, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	const chunkSize = 1024 * 1024 // 1MB
	buffer := make([]byte, chunkSize)

	fileInfo, err := file.Stat()
	if err != nil {
		panic(err)
	}

	totalChunks := int(fileInfo.Size()/int64(chunkSize)) + 1
	url := "http://10.30.14.50:9983/v1/smartvision/system/chunks/upload"
	t.Log(url)
	t.Log(totalChunks)
	for chunkNumber := 1; ; chunkNumber++ {
		pool <- struct{}{}
		n, err := file.Read(buffer)
		if err != nil && err != io.EOF {
			panic(err)
		}
		if n == 0 {
			break
		}

		if err := uploadChunk(url, buffer[:n], fileInfo.Name(), chunkNumber, totalChunks); err != nil {
			panic(err)
		}
		fmt.Printf("Uploaded chunk %d/%d\n", chunkNumber, totalChunks)
	}
}

func uploadChunk(url string, chunk []byte, fileName string, chunkNumber, totalChunks int) error {
	defer func() {
		<-pool
	}()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filepath.Base(fileName))
	if err != nil {
		return err
	}
	part.Write(chunk)

	writer.WriteField("chunk_number", fmt.Sprintf("%d", chunkNumber))
	writer.WriteField("total_chunks", fmt.Sprintf("%d", totalChunks))
	writer.WriteField("type", "upgrade")
	writer.WriteField("md5", "31b22acfe5ea763373df5a1b997fa472")

	if err := writer.Close(); err != nil {
		return err
	}

	request, err := http.NewRequestWithContext(context.Background(), "POST", url, body)
	if err != nil {
		return err
	}
	request.Header.Set("Content-Type", writer.FormDataContentType())
	request.Header.Set("Authorization", token)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	bs, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(bs))

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to upload chunk %d: %v", chunkNumber, resp.Status)
	}
	return nil
}