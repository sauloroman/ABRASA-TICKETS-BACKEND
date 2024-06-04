import express, { Router } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

interface ServerOptions {
  port: number;
  router: Router;
  publicPath?: string;
}

export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly router: Router;
  private readonly publicPath: string; 

  constructor( serverOptions: ServerOptions ) {
    const { port, router, publicPath = 'public' } = serverOptions;
    this.port = port;
    this.router = router;
    this.publicPath = publicPath;
  }

  public async start() {

    //* Middlewares
    this.app.use( cors() );
    this.app.use( express.json() );
    this.app.use( express.urlencoded({ extended: true }));
    this.app.use( fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: '/tmp/',
    }))

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    this.app.use( this.router );

    this.serverListener = this.app.listen( this.port, () => {
      console.log(`Server running in port ${ this.port }`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}