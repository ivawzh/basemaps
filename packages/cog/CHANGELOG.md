# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.6.0](https://github.com/linz/basemaps/compare/v1.5.1...v1.6.0) (2020-05-08)


### Features

* **cli:** submit jobs automatically to aws batch with --batch ([#583](https://github.com/linz/basemaps/issues/583)) ([6b35696](https://github.com/linz/basemaps/commit/6b356961a2f7d1497f51f69199aa038e64fbdca9))





# [1.5.0](https://github.com/linz/basemaps/compare/v1.4.2...v1.5.0) (2020-05-07)


### Bug Fixes

* **cli:** do not error when --replace-with is not supplied ([#577](https://github.com/linz/basemaps/issues/577)) ([2c4f5dc](https://github.com/linz/basemaps/commit/2c4f5dc5f46823ce4e6f03420b9ec9fc233505ea))
* **cli:** root quadkey causes issues with dynamodb so never use it ([#576](https://github.com/linz/basemaps/issues/576)) ([4dfa860](https://github.com/linz/basemaps/commit/4dfa86027980231514ae417ce59e94f02e78c3f6))





## [1.4.2](https://github.com/linz/basemaps/compare/v1.4.1...v1.4.2) (2020-05-06)

**Note:** Version bump only for package @basemaps/cog





## [1.4.1](https://github.com/linz/basemaps/compare/v1.4.0...v1.4.1) (2020-05-06)

**Note:** Version bump only for package @basemaps/cog





# [1.4.0](https://github.com/linz/basemaps/compare/v1.3.0...v1.4.0) (2020-05-06)


### Features

* **cog:** GZip cutline.geojson ([#570](https://github.com/linz/basemaps/issues/570)) ([c5e2e5e](https://github.com/linz/basemaps/commit/c5e2e5e03be657f046a877e314ee3a16d28e67af))





# [1.3.0](https://github.com/linz/basemaps/compare/v1.2.0...v1.3.0) (2020-05-05)


### Bug Fixes

* default resampling cubic to bilinear ([#552](https://github.com/linz/basemaps/issues/552)) ([978c789](https://github.com/linz/basemaps/commit/978c789d0bb448d2a0a2c28fcd6b4b1e45235659))
* **cog:** fix extractResolutionFromName for _10m ([c99d9f3](https://github.com/linz/basemaps/commit/c99d9f38ac8f2a951a44726352f15227e83e202c))
* action.batch missing await before storeLocal ([7ce960e](https://github.com/linz/basemaps/commit/7ce960e9767f3c7ed73644ab1dd611448e6fc596))
* allow 0 as GDAL_NODATA value ([1f79fab](https://github.com/linz/basemaps/commit/1f79fabd20a54134cd7d512a52b2a89469490b4c))
* compare only basename of tiff files in source.geojson ([9f1a5b9](https://github.com/linz/basemaps/commit/9f1a5b9c21b05e27ec7f15cf5c9d84e7016fa21f))
* don't default to -1 for nodata as it is not a valid nodata value ([21c4add](https://github.com/linz/basemaps/commit/21c4add21366cb9d154141de06dba864197d18b1))
* guess NZTM based projections from the image's WKT ([c80dbdc](https://github.com/linz/basemaps/commit/c80dbdc05538346a325b248569940795528e6ed5))
* throw a error if the GDAL/nodejs aws profiles mismatch ([d3c2100](https://github.com/linz/basemaps/commit/d3c21003c58ffd35ebf78929de5cf4c49a23805a))
* **cutline:** ignore path when updating vrt ([#504](https://github.com/linz/basemaps/issues/504)) ([714c554](https://github.com/linz/basemaps/commit/714c5540b6d678531a50f480695fe55f84735c41))
* wait for processing to finish before erroring about missing projection ([852d0eb](https://github.com/linz/basemaps/commit/852d0eb11db72b68731e162b1e75b291844173d1))


### Features

* **cli:** add ability to replace imagery with another imagery set ([015aae3](https://github.com/linz/basemaps/commit/015aae3112afb33853117824a347a7d83108963c))
* **cli:** create a tile set for all imagery processed ([#561](https://github.com/linz/basemaps/issues/561)) ([18e099e](https://github.com/linz/basemaps/commit/18e099e8d7ce615509775d35c9189168477b5816))
* **cli:** invalidate cloudfront cache when updating tileset information ([#554](https://github.com/linz/basemaps/issues/554)) ([b61b720](https://github.com/linz/basemaps/commit/b61b72024ef831b343d4e4febe499f3f7e352be4))
* **cli:** resubmit failed jobs if aws batch lists them as failed ([#563](https://github.com/linz/basemaps/issues/563)) ([40f6758](https://github.com/linz/basemaps/commit/40f67583c76823d58496961180cdbf54c9fcba66))
* **cli:** show imagery creation timestamps in logs ([#558](https://github.com/linz/basemaps/issues/558)) ([fb2b6e0](https://github.com/linz/basemaps/commit/fb2b6e0f08ecc05a5e8f6cb9a11ac469c610239d))
* **cli:** switch to priority numbers rather than array position ([#555](https://github.com/linz/basemaps/issues/555)) ([5dde7fd](https://github.com/linz/basemaps/commit/5dde7fd50ce1ea0faeb27c25030890a6c2fd6440))
* **cog:** create finer quadkeys for coverings ([#557](https://github.com/linz/basemaps/issues/557)) ([e47318b](https://github.com/linz/basemaps/commit/e47318bb222b68aaed180fdc2f8ead7f47c72a21))
* **cog:** Make cutline.Optimize produce fewer quadKeys ([dfa05dd](https://github.com/linz/basemaps/commit/dfa05dd87fd489cde3d240aa43c49d5e1c193f94))
* support tileset history ([#537](https://github.com/linz/basemaps/issues/537)) ([06760d4](https://github.com/linz/basemaps/commit/06760d4f1a6a28d0edc4f40f55cdf9db8e91f93f))
* **cog:** Apply cutline when generating COGs ([6ff625f](https://github.com/linz/basemaps/commit/6ff625fc078c32f46087bb06417c104f2b4f748c))
* **cog:** store metadata for imagery ([0b3aa34](https://github.com/linz/basemaps/commit/0b3aa346c7a1d8b7c1ba0a0edb3e28a69d8d7338))
* **cog/proj:** add quadKey utils ([22638d4](https://github.com/linz/basemaps/commit/22638d47fbceb58f03d8eaf26b06ad8f073c9a61))
* **CogJob:** add cutline option ([f8b71fd](https://github.com/linz/basemaps/commit/f8b71fdb00c246a92d920705b49e3505278bc632))
* **geo:** Add containsPoint to quadKey and trie ([a4b902a](https://github.com/linz/basemaps/commit/a4b902a1feeba5e80e813346f6c7d64d52199476))
* adding cli to configure rendering process ([13aae79](https://github.com/linz/basemaps/commit/13aae797b2143af8c08ed4da3c2013eacbbac082))
* allow importing existing imagery into database ([#452](https://github.com/linz/basemaps/issues/452)) ([64ee961](https://github.com/linz/basemaps/commit/64ee9611bc35b767f8edbfbdb638ac2aadb9dd80))





# [1.2.0](https://github.com/linz/basemaps/compare/v1.1.0...v1.2.0) (2020-03-25)


### Bug Fixes

* add resample param to buildWarpVrt ([44e1df1](https://github.com/linz/basemaps/commit/44e1df1b8c662b6c6050215342c092c683cc4d70))
* consolidated resample into cog ([9d69170](https://github.com/linz/basemaps/commit/9d691708d153d12d82c8468b2058728fb562a5a1))
* dockerfile to test resampling ([7e4638b](https://github.com/linz/basemaps/commit/7e4638bdc299267fa70474939db5221bf6def71c))
* modified batch to use updated cog args ([af95524](https://github.com/linz/basemaps/commit/af955243e5886b5b92b2da63a7b49f011add4967))
* offset is outside of the bounds. ([a3a786c](https://github.com/linz/basemaps/commit/a3a786c98aa0879d9d17af133c33996a87a830c4))
* parseint nodata value ([c6d65de](https://github.com/linz/basemaps/commit/c6d65de2ef0f22a9c3b936f43bd36f8f359c7b3b))
* read nodata from tiff ([64d3e9c](https://github.com/linz/basemaps/commit/64d3e9ccff5a0f4e97769bcc69e8b5b313fc31ef))
* remove resample arg from batch ([#364](https://github.com/linz/basemaps/issues/364)) ([6731166](https://github.com/linz/basemaps/commit/67311666f076b00850500da6786a6aec4f903905))
* review requests for naming/efficiency ([cda50c6](https://github.com/linz/basemaps/commit/cda50c63d2cf818fae48954d863190bfb792d56c))
* set resample at job creation ([7ab0335](https://github.com/linz/basemaps/commit/7ab0335d182ad41ebd740e0ae75fca85f4e2dfc3))
* undefined resamples + read str nodata ([e10871d](https://github.com/linz/basemaps/commit/e10871d4dbef846186d3536fb5bc51d5f1b617ac))
* unnegated srcnodata condition ([20e592d](https://github.com/linz/basemaps/commit/20e592d5913b307525435931f9c9a806e2bb063c))
* xxxnodata args added to warp command ([b415431](https://github.com/linz/basemaps/commit/b415431628929e313803a04b3322aa56704e7b52))


### Features

* add resample to batch ([1a45000](https://github.com/linz/basemaps/commit/1a45000b1d1271bf540caee0a53eaa12fda1be3f))
* added variable resampling methods ([07b3c3f](https://github.com/linz/basemaps/commit/07b3c3fe87a7e0d50fae6ab964a8651a7b19df1d))





# [1.1.0](https://github.com/linz/basemaps/compare/v1.0.0...v1.1.0) (2020-02-20)

**Note:** Version bump only for package @basemaps/cog





# [1.0.0](https://github.com/linz/basemaps/compare/v0.3.0...v1.0.0) (2020-02-18)


* refactor!: split packages out in preperation for publishing. ([c6f5cbb](https://github.com/linz/basemaps/commit/c6f5cbb5514659ce446460bc8637e7a00e403a49))


### BREAKING CHANGES

* this splits out the lambda/node dependencies from javascript so packages can be published for the browser





# [0.3.0](https://github.com/linz/basemaps/compare/v0.2.0...v0.3.0) (2020-02-11)


### Bug Fixes

* capture stder and report on in if it exists ([8b60624](https://github.com/linz/basemaps/commit/8b606245e6b30878cc874c1db76e4994e183395e))
* failed to find projections when geoasciiparams are not loaded ([55ece94](https://github.com/linz/basemaps/commit/55ece94260f36785b76469ab988490d5a9f0f502))
* support nzgd_2000 ([205b8fa](https://github.com/linz/basemaps/commit/205b8fa00649dc709645bf7a529e9be794e1d241))
* use the correct path for tiff lookups when resuming jobs ([01b7223](https://github.com/linz/basemaps/commit/01b7223bf3dae654a5efded3da106e8d08f4a5f3))





# [0.2.0](https://github.com/linz/basemaps/compare/v0.1.0...v0.2.0) (2020-01-29)


### Bug Fixes

* actually check if object exists in s3 ([789eb22](https://github.com/linz/basemaps/commit/789eb2280868f754552f147398fa773d8ef98983))
* do not overwrite existing files if they exist ([ea46fed](https://github.com/linz/basemaps/commit/ea46fed8ff2ccc9a9d92869822cefd886ce2c299))
* imagery size is off by one ([1d7047a](https://github.com/linz/basemaps/commit/1d7047a4cb1819bef1c0210b6c13f0362ebe2cc5))


### Features

* allow cli tiler to access data from s3 ([c033de3](https://github.com/linz/basemaps/commit/c033de32d09d69db997569ee61bd002f8ae62c82))
* configure the temp folder using TEMP_FOLDER environment var ([2762014](https://github.com/linz/basemaps/commit/27620144e31e687050225a33fb7a80f785161e54))
* guess projection if WKT is present ([a9c9cd6](https://github.com/linz/basemaps/commit/a9c9cd680b41bed0e2213fe8c0087653861a22ad))
* if output files already exist do not overwrite them. ([ab1b861](https://github.com/linz/basemaps/commit/ab1b8616cfc5fbbae7cd3ee59d308bb4f3c6e036))





# 0.1.0 (2020-01-23)


### Bug Fixes

* build some cogs ([8c1e6d9](https://github.com/linz/basemaps/commit/8c1e6d90ddf33aa852b69fdecebfd42fbb2a7045))
* not everything needs -addalpha ([223256d](https://github.com/linz/basemaps/commit/223256d40b9c5d561aca943faa71ac70c56edce0))
* only warp the vrt to 3857 if really required ([26610d8](https://github.com/linz/basemaps/commit/26610d8b0cd28beaefe57a620385ecec617691cb))
* remove unreachable break ([11e35d3](https://github.com/linz/basemaps/commit/11e35d3410b5913c5b5c94a2e66360e402dc4f75))


### Features

* adding gisborne_rural_2017-18_0.3m ([4491493](https://github.com/linz/basemaps/commit/449149344966948524b56f367cfd7c2de0cb3b1d))
* adding support for dry run of cogify ([9d4dbf2](https://github.com/linz/basemaps/commit/9d4dbf200642f3a9ffb028c6188e6bfbb47a8b9f))
* basic mosaic support ([cbd8e4c](https://github.com/linz/basemaps/commit/cbd8e4c1cb91974c4bced766d1c5167a3ab6d99a))
* better cogify command ([8f086eb](https://github.com/linz/basemaps/commit/8f086eb18b079d3a0243c421bd82607de24463c0))
* bundle cli into single javascript file ([3d77287](https://github.com/linz/basemaps/commit/3d772873841cd9eee32d1e08a9b383fc16fe3a93))
* cache the bounding box creation into .cache to save on a lot of s3 requests ([cbe5e70](https://github.com/linz/basemaps/commit/cbe5e70efc714ef5f551e4516cd3e21e80a79a19))
* convert a tif using a docker based gdal ([9777363](https://github.com/linz/basemaps/commit/977736384987d203c47d5e3b4a9b015dea5ee1ca))
* export a geojson covering if requested ([99b8438](https://github.com/linz/basemaps/commit/99b84389a06dd384dad9479bda2b049a597ac171))
* expose the cogify cli ([fe38aee](https://github.com/linz/basemaps/commit/fe38aeeb15b3fd17b2bc4ea6861a76a12339c927))
* gdal docker build vrts ([54d8714](https://github.com/linz/basemaps/commit/54d8714789c896c624d1f6fd809537f5b96ac60e))
* given a list of tiff files generate a webmercator covering ([9aaf7f2](https://github.com/linz/basemaps/commit/9aaf7f2640a4396d813c48209dd88a159f1b284f))
* load and convert bounds of imagery ([68df2a4](https://github.com/linz/basemaps/commit/68df2a4cbc5ad7d227a573b2db602e9a927d7bb5))
* nzdg2000 support ([fc4a4e2](https://github.com/linz/basemaps/commit/fc4a4e29fa176766ed2376a82541007b07ba46cc))
* prepare for splitting of polygons that span the antimeridian ([e7c3a51](https://github.com/linz/basemaps/commit/e7c3a510303d2ddd252f7f3dd18b2c7ce4a3fe8f))
* pretty print the cli if it is outputing to a tty ([d406059](https://github.com/linz/basemaps/commit/d40605974a8258ab40566e1e2c1ea6c4ba9f2341))
* process cogs using AWS batch ([8602ba8](https://github.com/linz/basemaps/commit/8602ba86db10c52267a71094c9836fc26f03bba5))
* quadkey intersections ([0c41194](https://github.com/linz/basemaps/commit/0c41194b50b0f569f344328f6234accdd891b618))
* simple cli to generate cogs ([f11896e](https://github.com/linz/basemaps/commit/f11896ea751046a2e158600215b77a85455caf97))
* simple container to run cli ([2946a19](https://github.com/linz/basemaps/commit/2946a192d7b87c53c6227b961998be1aae2f3ef9))
* supply aws credentials to gdal if needed ([1f57609](https://github.com/linz/basemaps/commit/1f5760940ac51dac9dbb0e62b601183ace7437a6))
* support 3857 in projections ([816d8f6](https://github.com/linz/basemaps/commit/816d8f6873de969aca9a4a22ce222d5ed49d51a1))
* tile covering for webmercator tiles ([cd982d7](https://github.com/linz/basemaps/commit/cd982d7006c7509a4ae350c83a47dcadb90e6918))
