export async function readMicrophone() {
  if (
    !('AudioContext' in window) ||
    !('mediaDevices' in navigator) ||
    !('getUserMedia' in navigator.mediaDevices)
  ) {
    console.error(
      'Web Audio API and getUserMedia() method are not supported in this browser.' +
        '\nu dumb or wat'
    );
    return;
  }

  try {
    const audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create a new MediaStreamAudioSourceNode
    const sourceNode = audioContext.createMediaStreamSource(stream);
    debugger;

    // Connect the source node to the destination (output)
    sourceNode.connect(audioContext.destination);
  } catch (error) {
    console.error('Error getting user media:', error);
  }
  return '';
}
