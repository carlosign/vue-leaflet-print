// Normaliza commits sin fecha válida para evitar "Invalid time value"
module.exports = {
  writerOpts: {
    transform(commit) {
      // Si por algún motivo no viene la fecha, seteamos una válida
      if (!commit.committerDate) {
        commit.committerDate = new Date().toISOString();
      }
      return commit;
    },
  },
};
