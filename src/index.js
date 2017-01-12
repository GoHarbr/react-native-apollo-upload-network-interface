import { printAST } from 'apollo-client';
import { HTTPFetchNetworkInterface, printRequest } from 'apollo-client/networkInterface';
import RNFetchBlob from 'react-native-fetch-blob';
import _ from 'lodash';
export default function createNetworkInterface(opts) {
    const { uri } = opts;
    return new UploadNetworkInterface(uri, opts)
}

export class UploadNetworkInterface extends HTTPFetchNetworkInterface {
    getFormData({request},query){
        return [
            {
                name: 'operationName',
                data: request.operationName
            },
            {
                name: "variables",
                data: JSON.stringify(_.omit(request.variables, [request.variables.input.blobFieldName,'fileName']))
            },
            {
                filename: request.variables.fileName,
                type: request.variables[request.variables.input.blobFieldName].split(";")[0].split(":")[1],
                name: request.variables.input.blobFieldName,
                data: request.variables[request.variables.input.blobFieldName].split(",")[1]
            },
            {
                name: 'query',
                data: query,
            }
        ];
    }


    fetchFromRemoteEndpoint(req) {
        const options = this.getJSONOptions(req);
        if(this.isUpload(req)){
            this.performUploadMutation(req);
        }
        return fetch(this._uri, options);
    }

    performUploadMutation(req){
        const query = printAST(req.request.query);
        const data = this.getFormData(req,query);
        return RNFetchBlob.fetch('POST', this._uri, {
            'Content-Type': 'multipart/form-data',
            'Accept': '*/*',
        }, data).catch((err) => {});

    }
    isUpload({ request }) {
        if (request.variables) {
            for (let key in request.variables.input) {
                if (key == 'blobFieldName') {
                    return true
                }
            }
        }
        return false
    }

    getJSONOptions({ request, options }) {
        console.log('jsonreq');
        return Object.assign({}, this._opts, {
            body: JSON.stringify(printRequest(request)),
            method: 'POST',
        }, options, {
            headers: Object.assign({}, {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            }, options.headers),
        })
    }

}