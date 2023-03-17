const { Server } = require('socket.io')
const cors = require("cors");
const handlebars = require("express-handlebars");

const corsConfig = require("./config/cors.config");

class App {
  app;
  env;
  port;
  server;

  constructor(routes) {
    this.app = express();
    this.port = 5000;
    this.initHandlebars();
    this.listenWebSocket();
  }

  getServer() {
    return this.app;
  }

  closeServer(done) {
    this.server = this.app.listen(this.port, () => {
      done();
    });
  }

  initializeMiddlewares() {
    this.app.use(cors(corsConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(`${__dirname}/public`));
  }

  listenWebSocket(httpServer) {
    const io = new Server(httpServer);

    io.on("connection", async (socket) => {
      console.log(`New Socket Connection`)

      socket.on("message", async (message) => {
        // se crea un nuevo mensaje con los valores recibidos desde el front (user, message)
        const newMessage = await messagesModel.create({
          user: message.user,
          message: message.message,
        });

        if (newMessage) {
          // si se creo en la base de datos, devuelvo la lista completa de mensajes
          const messages = await messagesModel.find({})
          io.emit("messageLogs", messages);
        }
      });

      // SOCKET PARA AUTENTICACION (registrar un nombre de usuario)
      socket.on("authenticated", async (user) => {
        const messages = await messagesModel.find({});
        socket.broadcast.emit("newUserConnected", user);
        // devuelvo todos los mensajes al nuevo usuario
        io.emit("loadMessages", messages);
      });
    });
  }

  initHandlebars() {
    this.app.engine("handlebars", handlebars.engine());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "handlebars");
  }
}

module.exports = App;
