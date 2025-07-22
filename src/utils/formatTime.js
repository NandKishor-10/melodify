export default function formatTime(totalSeconds) {
  totalSeconds = Math.floor(totalSeconds);

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}