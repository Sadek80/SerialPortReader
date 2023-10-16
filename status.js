const message = document.querySelector('#message')

message.innerText = ""

if ("serial" in navigator) {
  console.log("Awesome, The serial port is supported.")
  // The Web Serial API is supported.
};

document.querySelector('#openSerialPort').addEventListener('click', async () => {
  //The Prompt will open to user to select's any serial port.
  const port = await navigator.serial.requestPort(); 

  await port.open({ baudRate: 9600 });

  // Default Reader that reads only bytes
  //const reader = port.readable.getReader();


  // Text decoder readet to decode bytes to text

   const textDecoder = new TextDecoderStream();
   const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
   const textDecoderReader = textDecoder.readable.getReader();

   // Writer
   const textEncoder = new TextEncoderStream();
   const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
   const writer = textEncoder.writable.getWriter();

   document.querySelector('#writeToSerialPort').addEventListener('click', async () => {
    console.log("write")
    await writer.write("hello");
 })

 // Closing Serial Port requires to cancel the reader then release the lock of the port reader first then close the port

 //document.querySelector('#closeSerialPort').addEventListener('click', async () => {
  //     textDecoderReader.cancel();
  //     textDecoderReader.releaseLock();
  //     await readableStreamClosed.catch(() => { /* Ignore the error */ });

  //     writer.close();
  //     await writableStreamClosed;

  //     await port.close();

  //     console.log("Closed");
  //  })
 
 // Listen to data coming from the serial device.

   while (true) {
    const { value, done } = await textDecoderReader.read();

    console.log("done" + done)
    console.log("valus is" + value);
    
    if (done) {
     textDecoderReader.releaseLock();
     break;
    }
   }

   textDecoderReader.cancel();
   await readableStreamClosed.catch(() => { /* Ignore the error */ });

   writer.close();
   await writableStreamClosed;

   await port.close();
});