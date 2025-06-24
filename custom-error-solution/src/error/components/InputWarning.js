import '../css/InputWarning.css';

export default function InputWarning({ message }) {
  if (!message) return null;
  return <div className="input-warning">{message}</div>;
}