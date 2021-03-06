import * as o from 'ospec';
import { FileOperatorSimple } from '../file.local';
import { unlinkSync, statSync } from 'fs';

function rmF(path: string): void {
    try {
        unlinkSync(path);
    } catch (_err) {}
}

o.spec('file.local', () => {
    const jsonFilePath = __dirname + '/testing.writeJson.json';
    const jsonFilePathGz = jsonFilePath + '.gz';

    o.afterEach(() => {
        rmF(jsonFilePathGz);
        rmF(jsonFilePath);
    });

    o('readJson writeJson gzip', async () => {
        await FileOperatorSimple.writeJson(jsonFilePathGz, { json: '1'.repeat(1000) });
        const ans = await FileOperatorSimple.readJson(jsonFilePathGz);
        o(statSync(jsonFilePathGz).size).equals(44);
        o(ans).deepEquals({ json: '1'.repeat(1000) });
    });

    o('readJson writeJson', async () => {
        await FileOperatorSimple.writeJson(jsonFilePath, { json: '1'.repeat(1000) });
        const ans = await FileOperatorSimple.readJson(jsonFilePath);
        o(statSync(jsonFilePath).size).equals(1016);
        o(ans).deepEquals({ json: '1'.repeat(1000) });
    });
});
