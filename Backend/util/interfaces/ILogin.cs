
namespace util.interfaces {
    public interface ILogin {
        /// <summary>
        /// Metodo que valida que un usuario tenga una session en tsegusuariosession vigente para poder ejecutar transacciones.
        /// </summary>
        /// <param name="cusuario"></param>
        /// <param name="ccompania"></param>
        /// <param name="serial"></param>
        void Validarlogin(string cusuario, int ccompania, string ccanal, string serial);
    }
}
