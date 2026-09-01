import Swal from "sweetalert2";

function SweetAlert(title, isError) {
  Swal.fire({
    toast: true,
    title: title,
    icon: isError ? "error" : "success",
    width: "25rem",
    position: "top-right",
    timer: 2000,
    showCloseButton: true,
    timerProgressBar: true,
    showConfirmButton: false,
    showCancelButton: false,
    customClass: {
      popup: "colored-toast",
    },
    showClass: {
      popup: "animate__animated animate__bounceInRight",
    },
    hideClass: {
      popup: "animate__animated animate__bounceOutRight",
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

const showConfirmDialog = async (
  title,
  text,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel"
) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: '#668FA3',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  });
  // Return a promise that resolves with the confirm result
  return result.isConfirmed;
};

export { SweetAlert, showConfirmDialog };
