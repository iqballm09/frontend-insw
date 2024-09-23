import moment from "moment";

export const getDateNow = () => {
  // Buat objek moment dengan tanggal dan waktu saat ini
  const currentDate = moment();

  // Format tanggal dan waktu sesuai dengan permintaan
  const formattedDate = currentDate.format("dddd, D MMMM YYYY - HH:mm:ss");

  return formattedDate;
};
