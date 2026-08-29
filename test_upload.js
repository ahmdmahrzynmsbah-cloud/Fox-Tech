import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch'; // need to use standard fetch in node 18+

async function test() {
  const fileId = 'test1234';
  const chunkData = Buffer.alloc(500 * 1024, 'a'); // 500KB

  const formData = new FormData();
  formData.append('chunkIndex', '0');
  formData.append('fileId', fileId);
  formData.append('chunk', chunkData, { filename: 'chunk-0.bin', contentType: 'application/octet-stream' });

  const res = await fetch('http://localhost:3000/api/upload-chunk', {
    method: 'POST',
    body: formData
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
test();
