/**
 * Where the fuck I put that
 * ¯\_(ツ)_/¯
 */
function getFormattedDate(timestamp) {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2); // The month is 0-indexed, so we add 1
  let day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
}