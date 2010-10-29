<cfcomponent output="no">
	<!--- COMMON --->
	<cfset variables.dsn = "mark_ora_dev" />
	
	<!--- REMOTE --->
	<cffunction name="search_agencies" access="remote" returnformat="json">
		<cfargument name="term" required="yes" />
		<cfreturn build_query(
			ARGUMENTS.term, 
			"WELLINV.WIAGENCY", 
			"AGE", 
			"ANAME") />
	</cffunction>

	<cffunction name="search_counties" access="remote" returnformat="json">
		<cfargument name="term" required="yes" />
		<cfreturn build_query(
			ARGUMENTS.term, 
			"COUNTY", 
			"COUNTY_CD", 
			"COUNTY_NAME") />
	</cffunction>

	<cffunction name="search_pesticides" access="remote" returnformat="json">
		<cfargument name="term" required="yes" />
		<cfreturn build_query(
			ARGUMENTS.term, 
			"WELLINV.WICHEM", 
			"NEW_CHEMCODE", 
			"CHNAME") />
	</cffunction>
		
	<!--- PRIVATE --->
	<cffunction name="build_query" access="private">
		<cfargument name="term" />
		<cfargument name="tbl" />
		<cfargument name="id" />
		<cfargument name="value" />
		<cfargument name="limit" type="numeric" default="30" />
		
		<cfquery datasource="#variables.dsn#" name="records" maxRows="#arguments.limit#">
		SELECT
			#arguments.id# as CODE,
			#arguments.value# as TEXT
		FROM
			#arguments.tbl#
		WHERE
			UPPER(#arguments.value#) LIKE UPPER(<cfqueryparam value="%#arguments.term#%">)
		</cfquery>
		
		<cfset var recordArray = [] />
		<cfloop query="records">
			<cfset ArrayAppend(recordArray, {"value"=records.code, "label"=records.text}) />
		</cfloop>
		
		<cfreturn recordArray />
	</cffunction>
</cfcomponent>