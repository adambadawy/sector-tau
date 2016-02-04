from flask import Flask


# Construct the app. Global so we can reference it in route decorators.
app = Flask(__name__)


def serve(item):
	with open(item, 'rb') as f:
		return f.read()


@app.route('/')
def serve_index():
    return serve('index.min.html')


@app.route('/res/<resource>')
def serve_res(resource):
	return serve('res/%s' % resource)


@app.route('/lib/<libname>')
def serve_lib(libname):
	return serve('lib/%s' % libname)


@app.route('/src/<scriptname>')
def serve_src(scriptname):
	return serve('src/%s' % scriptname)


if __name__ == '__main__':
    # If we're in `debug`, the server's gotta be private. Major security hazard.
    debug = False
    host = '127.0.0.1' if debug else '0.0.0.0'
    app.run(host=host, port=5028, debug=debug)
