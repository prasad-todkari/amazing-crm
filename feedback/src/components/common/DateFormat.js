export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('en-IN', options);
}

export const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval === 1 ? "1 year ago" : `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000); // 30 days
    if (interval >= 1) {
        return interval === 1 ? "1 month ago" : `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400); // 1 day
    if (interval >= 1) {
        return interval === 1 ? "1 day ago" : `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600); // 1 hour
    if (interval >= 1) {
        return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60); // 1 minute
    if (interval >= 1) {
        return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }
    return "just now";
}

